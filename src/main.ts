import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'https://hlt-binarcarrental-platinum.vercel.app'],
    credentials: true,
  });

  await app.listen(3100);
}
bootstrap();
