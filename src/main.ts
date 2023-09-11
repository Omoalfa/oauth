import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from "dotenv";
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  await app.listen(process.env.PORT);
}
bootstrap();
