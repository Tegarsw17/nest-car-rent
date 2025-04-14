import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'https://hlt-binarcarrental-platinum.vercel.app'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Car Rental Management API')
    .setDescription('API documentation for Car Rental Management System')
    .setVersion('1.0')
    .addBearerAuth() // For JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3100);
}
bootstrap();
