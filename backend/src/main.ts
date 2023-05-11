import { NestFactory } from '@nestjs/core';
import {ConfigService} from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);
  const port = config.get<number>('API_PORT');
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(port || 3000, () => {
    console.log(`App started on port: ${port}`);
  });
}
bootstrap();
