import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnRequest, ReturnRequestSchema } from '@/database/schemas/return-request.schema';
import { Order, OrderSchema } from '@/database/schemas/order.schema';
import { OrderModule } from '../order/order.module';
import { ReturnRequestService } from './return-request.service';
import { ReturnRequestController } from './return-request.controller';
import { ReturnRequestAdminController } from './return-request-admin.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: ReturnRequest.name, schema: ReturnRequestSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    AuthModule,
    UserModule,
    OrderModule,
  ],
  controllers: [ReturnRequestController, ReturnRequestAdminController],
  providers: [ReturnRequestService],
  exports: [ReturnRequestService],
})
export class ReturnRequestModule {}
