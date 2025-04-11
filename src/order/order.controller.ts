import { Body, Controller, Get, NotFoundException, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    async createOrder(@Body() body: any) {
        return this.orderService.createOrder(body);
    }

    @Get('/:id')
    async getOrderById(@Param('id') id: number) {
        const car = await this.orderService.getOrderById(id);
        if (!car) throw new NotFoundException('Order not found');
        return car;
    }

    @Put(':id/slip')
    @UseInterceptors(FileInterceptor('slip'))
    // @UseGuards(JwtAuthGuard) // Uncomment if protected
    async uploadSlip(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const result = await this.orderService.uploadPaymentSlip(id, file);
        return result;
    }
}
