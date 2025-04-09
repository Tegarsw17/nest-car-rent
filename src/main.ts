import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // or your Vite app URL
    credentials: true, // if you’re using cookies/auth
  });

  await app.listen(3100);
}
bootstrap();
