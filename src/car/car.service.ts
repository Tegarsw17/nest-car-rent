import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarService {
    constructor(
        @InjectRepository(Car)
        private readonly carRepo: Repository<Car>, // ✅ inject repo
    ) { }
    async findCars(filters: {
        name?: string;
        category?: string;
        isRented?: boolean;
        minPrice?: number;
        maxPrice?: number;
        page: number;
        pageSize: number;
    }) {
        const { name, category, isRented, minPrice, maxPrice, page, pageSize } = filters;

        const query = this.carRepo.createQueryBuilder('car');

        if (name) query.andWhere('LOWER(car.name) LIKE LOWER(:name)', { name: `%${name}%` });
        if (category) query.andWhere('car.category = :category', { category });
        if (typeof isRented === 'boolean') query.andWhere('car.isRented = :isRented', { isRented });
        if (!isNaN(minPrice)) query.andWhere('car.price >= :minPrice', { minPrice });
        if (!isNaN(maxPrice)) query.andWhere('car.price <= :maxPrice', { maxPrice });

        const [cars, total] = await query
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        const pageCount = Math.ceil(total / pageSize);

        return {
            cars,
            page,
            pageCount,
        };
    }

    async getCarById(id: number): Promise<Car> {
        return this.carRepo.findOne({ where: { id } });
    }

}
