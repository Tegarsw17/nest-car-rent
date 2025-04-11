import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Car } from '../car/car.entity';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(Car) private carRepo: Repository<Car>,
    ) { }

    async createOrder(data: {
        car_id: number;
        start_rent_at: string;
        finish_rent_at: string;
    }) {
        const { car_id, start_rent_at, finish_rent_at } = data;

        const car = await this.carRepo.findOne({ where: { id: car_id } });
        if (!car) throw new NotFoundException('Car not found');

        const start = new Date(start_rent_at);
        const end = new Date(finish_rent_at);
        const dayDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

        if (dayDiff > 7) {
            throw new BadRequestException({ error: 'Rent duration cannot exceed 7 days' });
        }

        const total_price = dayDiff * car.price;

        const order = this.orderRepo.create({
            car,
            start_rent_at: start,
            finish_rent_at: end,
            total_price,
        });

        await this.orderRepo.save(order);

        return {
            id: order.id,
            statusText: 'Order created successfully',
        };
    }

    async getOrderById(id: number) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['car'],
        });

        if (!order) return null;

        return {
            id: order.id,
            Car: {
                id: order.car.id,
                name: order.car.name,
                category: order.car.category,
                price: order.car.price,
                imageUrl: order.car.imageUrl,
            },
            start_rent_at: order.start_rent_at,
            finish_rent_at: order.finish_rent_at,
            total_price: order.total_price,
            slip_url: order.slip_url
        };
    }

    async uploadPaymentSlip(orderId: number, file: Express.Multer.File) {
        const order = await this.orderRepo.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'car-rent/slip',
                },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                },
            );
            Readable.from(file.buffer).pipe(stream);
        });

        const { secure_url } = result as any;

        order.slip_url = secure_url;
        await this.orderRepo.save(order);

        return {
            statusText: 'Payment slip uploaded successfully',
            slipUrl: secure_url,
        };
    }
}
