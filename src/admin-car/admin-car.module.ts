import { Module } from '@nestjs/common';
import { AdminCarService } from './admin-car.service';
import { AdminCarController } from './admin-car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Car } from '../car/car.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
    AuthModule, // 👈 brings in JwtModule via export
  ],
  providers: [AdminCarService],
  controllers: [AdminCarController]
})
export class AdminCarModule { }
