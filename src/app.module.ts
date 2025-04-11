import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CarModule } from './car/car.module';
import { AdminCarModule } from './admin-car/admin-car.module';
import { OrderModule } from './order/order.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // or paste the URI directly here
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CarModule,
    AdminCarModule,
    OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
