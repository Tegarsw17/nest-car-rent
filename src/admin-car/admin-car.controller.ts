// src/admin-car/admin-car.controller.ts
import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { AdminCarService } from './admin-car.service';
import { FileInterceptor } from '@nestjs/platform-express';
// Import your JWT auth guard (assumes it's already implemented in your project)
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin/car')
export class AdminCarController {
    constructor(private readonly adminCarService: AdminCarService) { }

    @Post()
    @UseGuards(JwtAuthGuard)  // This will ensure the access_token is validated
    @UseInterceptors(FileInterceptor('image'))
    async createCar(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        console.log('File:', file);
        console.log('Body:', body);
        return this.adminCarService.addCar(file, body);
    }
}
