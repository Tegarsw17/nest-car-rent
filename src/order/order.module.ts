import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from 'src/car/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Car])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
