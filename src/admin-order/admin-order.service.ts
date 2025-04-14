// src/admin-order/admin-order.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminOrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
    ) { }

    async getOrders({
        page,
        pageSize,
        sort,
    }: {
        page: number;
        pageSize: number;
        sort: string;
    }) {
        const [sortBy, sortOrder] = sort.split(':');

        const [orders, total] = await this.orderRepo.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            relations: ['car', 'user'],
            order: {
                [sortBy]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
        });

        const pageCount = Math.ceil(total / pageSize);

        return {
            orders: orders.map((order) => ({
                id: order.id,
                status: order.status,
                total_price: order.total_price,
                start_rent_at: order.start_rent_at,
                finish_rent_at: order.finish_rent_at,
                created_at: order.created_at,
                updated_at: order.updated_at,
                email: "dummy@mail.com",
                Car: order.car
                    ? {
                        id: order.car.id,
                        name: order.car.name,
                        category: order.car.category,
                        price: order.car.price,
                        imageUrl: order.car.imageUrl,
                    }
                    : null,
                User: order.user
                    ? {
                        id: order.user.id,
                        email: order.user.email,
                        name: order.user.name,
                    }
                    : null,
            })),
            currentPage: page,
            pageCount,
        };
    }

    async updateStatus(orderId: number, status: boolean) {
        const order = await this.orderRepo.findOne({ where: { id: orderId } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.status = status;
        await this.orderRepo.save(order);

        return {
            statusText: 'Order status updated successfully',
            updatedOrderId: order.id,
            newStatus: order.status,
        };
    }

    async getOrderReport(from: string, until: string) {
        const startDate = new Date(from);
        const endDate = new Date(until);

        const report: Record<string, number> = {};
        for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
        ) {
            const iso = d.toISOString().split('T')[0];
            report[iso] = 0;
        }
        for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
        ) {
            const dayStr = d.toISOString().split('T')[0];
            report[dayStr] = 0;
        }

        const rawOrders = await this.orderRepo
            .createQueryBuilder('order')
            .select("TO_CHAR(order.start_rent_at, 'YYYY-MM-DD')", 'day')
            .addSelect('COUNT(*)', 'orderCount')
            .where('order.start_rent_at BETWEEN :from AND :until AND order.status = true', { from, until })
            .groupBy('day')
            .getRawMany();

        // console.log("ini orders", orders);

        for (const row of rawOrders) {
            report[row.day] = parseInt(row.orderCount);
        }

        return Object.entries(report).map(([day, orderCount]) => ({
            day,
            orderCount,
        }));
    }

}
