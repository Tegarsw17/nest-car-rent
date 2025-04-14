// src/admin-order/admin-order.controller.ts
import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminOrderService } from './admin-order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/order')
@UseGuards(JwtAuthGuard)

export class AdminOrderController {
    constructor(private readonly adminOrderService: AdminOrderService) { }

    @Get()
    // @UseGuards(JwtAuthGuard)
    async getOrders(
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '10',
        @Query('sortBy') sortBy = 'created_at:asc',
    ) {
        return this.adminOrderService.getOrders({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            sort: sortBy,
        });
    }

    @Patch(':id')
    async patchOrderStatus(
        @Param('id') id: number,
        @Body('status') statusWrapper: { status: boolean },
    ) {
        const status = statusWrapper?.status;
        return this.adminOrderService.updateStatus(id, status);
    }

    @Get('/reports')
    async getReport(
        @Query('from') from: string,
        @Query('until') until: string,
    ) {
        return this.adminOrderService.getOrderReport(from, until);
    }
}
