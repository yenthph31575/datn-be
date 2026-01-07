import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReturnRequestType, ReturnRequestStatus, ShippingFeePayer } from '@/shared/enums';

@Schema({ _id: false })
export class ReturnItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false })
  variantId?: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

const ReturnItemSchema = SchemaFactory.createForClass(ReturnItem);

@Schema({ timestamps: true, collection: 'return_requests' })
export class ReturnRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({
    type: String,
    enum: ReturnRequestType,
    required: true,
  })
  type: ReturnRequestType;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ReturnRequestStatus,
    default: ReturnRequestStatus.PENDING,
  })
  status: ReturnRequestStatus;

  @Prop({ type: [ReturnItemSchema], required: true })
  items: ReturnItem[];

  @Prop({ type: Types.ObjectId, ref: 'Order', default: null })
  exchangeOrderId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  // Bank Info for Refund (Required if type is RETURN)
  @Prop({
    type: {
      bankName: { type: String },
      bankAccount: { type: String },
      bankAccountName: { type: String },
    },
    required: false,
    _id: false,
  })
  refundInfo?: {
    bankName: string;
    bankAccount: string;
    bankAccountName: string;
  };

  @Prop({ type: String })
  adminNote: string;
}

export const ReturnRequestSchema = SchemaFactory.createForClass(ReturnRequest);
