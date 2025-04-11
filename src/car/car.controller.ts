import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { CarService } from './car.service';

@Controller('car')
export class CarController {
    constructor(private readonly carService: CarService) { }
    @Get('/')
    async getCars(
        @Query('name') name?: string,
        @Query('category') category?: string,
        @Query('isRented') isRented?: string,
        @Query('minPrice') minPrice?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '9',
    ) {
        return this.carService.findCars({
            name,
            category,
            isRented: isRented === 'true',
            minPrice: parseInt(minPrice),
            maxPrice: parseInt(maxPrice),
            page: parseInt(page),
            pageSize: parseInt(pageSize),
        });
    }

    @Get('/:id')
    async getCarById(@Param('id') id: number) {
        const car = await this.carService.getCarById(id);
        if (!car) throw new NotFoundException('Car not found');
        return car;
    }
}
