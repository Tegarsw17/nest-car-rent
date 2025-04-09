// src/admin-car/admin-car.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../car/car.entity';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary using environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
@Injectable()
export class AdminCarService {
    constructor(
        @InjectRepository(Car)
        private carRepo: Repository<Car>,
    ) { }

    private async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'car-rent',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            Readable.from(file.buffer).pipe(uploadStream);
        });
    }

    async addCar(file: Express.Multer.File, body: any) {
        if (!file || !body.name || !body.category || !body.price) {
            throw new BadRequestException({ error: 'Missing required fields' });
        }

        try {
            const uploadResult = await this.uploadToCloudinary(file);

            const car = this.carRepo.create({
                name: body.name,
                category: body.category,
                price: Number(body.price),
                imageUrl: uploadResult.secure_url,
            });

            await this.carRepo.save(car);

            return {
                statusText: 'Car added successfully',
                data: {
                    id: car.id,
                    name: car.name,
                    category: car.category,
                    price: car.price,
                    imageUrl: car.imageUrl,
                },
            };
        } catch (error) {
            console.error('Upload Error:', error);
            throw new InternalServerErrorException({ error: 'Could not add car' });
        }
    }
}