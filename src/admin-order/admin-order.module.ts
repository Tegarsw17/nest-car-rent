import { Module } from '@nestjs/common';
import { AdminOrderController } from './admin-order.controller';
import { AdminOrderService } from './admin-order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [AdminOrderController],
  providers: [AdminOrderService]
})
export class AdminOrderModule { }
