import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReturnRequest } from '@/database/schemas/return-request.schema';
import { Order, OrderDocument } from '@/database/schemas/order.schema';
import { CreateReturnRequestDto } from './dto/create-return-request.dto';
import { UpdateReturnRequestStatusDto } from './dto/update-return-request-status.dto';
import { ReturnRequestStatus, ReturnRequestType, OrderItemStatus } from '@/shared/enums';
import { OrderService } from '@/modules/order/services/order.service';

@Injectable()
export class ReturnRequestService {
  constructor(
    @InjectModel(ReturnRequest.name) private returnRequestModel: Model<ReturnRequest>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private orderService: OrderService,
  ) {}

  async create(userId: string, createDto: CreateReturnRequestDto): Promise<ReturnRequest> {
    const { orderId, items } = createDto;

    // Validate Order
    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId),
    });

    console.log(userId, orderId);

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Ensure order is delivered and within 3 days
    if (order.shippingStatus !== 'DELIVERED') {
      throw new BadRequestException('Đơn hàng chưa được giao');
    }

    if (!order.deliveredAt) {
      throw new BadRequestException('Ngày giao hàng không được ghi nhận');
    }

    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const deliveredTime = new Date(order.deliveredAt).getTime();

    if (now - deliveredTime > threeDaysInMillis) {
      throw new BadRequestException(
        'Yêu cầu trả hàng hoán tiền chỉ có thể được thực hiện trong 3 ngày kể từ ngày giao hàng',
      );
    }

    // Validate request items exist in order
    // (Simplified check, ideally should check variants and quantities)

    const returnRequest = new this.returnRequestModel({
      ...createDto,
      userId: new Types.ObjectId(userId),
      orderId: new Types.ObjectId(orderId),
    });

    return returnRequest.save();
  }

  async findAllJson(query: any) {
    const { page = 1, limit = 10, status, type, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    // If search is provided, find matching orders by order code
    if (search) {
      const orders = await this.orderModel.find({ orderCode: { $regex: search, $options: 'i' } }).select('_id');

      const orderIds = orders.map((order) => order._id);
      filter.orderId = { $in: orderIds };
    }

    const [items, total] = await Promise.all([
      this.returnRequestModel
        .find(filter)
        .populate('userId', 'fullName email')
        .populate('orderId', 'orderCode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.returnRequestModel.countDocuments(filter),
    ]);

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findMyRequests(userId: string) {
    return this.returnRequestModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('orderId', 'orderCode')
      .sort({ createdAt: -1 });
  }

  async findOne(id: string): Promise<ReturnRequest> {
    const request = await this.returnRequestModel.findById(id).populate('userId', 'fullName email').populate('orderId');

    if (!request) throw new NotFoundException('Return request not found');
    return request;
  }

  async updateStatus(id: string, updateDto: UpdateReturnRequestStatusDto): Promise<ReturnRequest> {
    const request = await this.returnRequestModel.findById(id);
    if (!request) throw new NotFoundException('Return request not found');

    if (request.status === updateDto.status) {
      return request;
    }

    // Process logic only if status actually changes
    if (updateDto.status === ReturnRequestStatus.APPROVED && request.status === ReturnRequestStatus.PENDING) {
      const order = await this.orderModel.findById(request.orderId);
      if (!order) throw new BadRequestException('Associated order not found');

      if (request.type === ReturnRequestType.RETURN) {
        // Update Order Items Status
        await this.updateOrderItemsStatus(order, request.items, OrderItemStatus.RETURNED);
      } else if (request.type === ReturnRequestType.EXCHANGE) {
        // Update Old Order Items Status AND Create New Order
        await this.updateOrderItemsStatus(order, request.items, OrderItemStatus.EXCHANGED);

        // Create New Exchange Order
        if (request.items && request.items.length > 0) {
          const newOrder = await this.orderService.createExchangeOrder(order);

          request.exchangeOrderId = (newOrder as any)._id;
        }
      }
    } else if (updateDto.status === ReturnRequestStatus.REJECTED) {
      // Handle rejection logic if needed (e.g. unlock return attempts?)
    }

    request.status = updateDto.status;
    request.adminNote = updateDto.adminNote;
    return request.save();
  }

  private async updateOrderItemsStatus(order: OrderDocument, items: any[], status: OrderItemStatus) {
    // Logic to find and update specific items in the Order
    // This is tricky because Order.items is an array.
    // We need to match productId/variantId to update correct items.

    let updated = false;
    const orderItems = order.items;

    for (const returnItem of items) {
      const matchIndex = orderItems.findIndex(
        (oi) =>
          oi.productId.toString() === returnItem.productId.toString() &&
          ((!oi.variantId && !returnItem.variantId) || oi.variantId?.toString() === returnItem.variantId?.toString()),
        // && oi.itemStatus === 'NORMAL' // Optional: Prevent double updates
      );

      if (matchIndex !== -1) {
        orderItems[matchIndex].itemStatus = status;
        updated = true;
      }
    }

    if (updated) {
      await this.orderModel.updateOne({ _id: order._id }, { items: orderItems, isReturn: true });
    }
  }
}
