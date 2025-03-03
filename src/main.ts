import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { config as dotenv } from 'dotenv';

import { AppModule } from './app.module';


dotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
  );
}
bootstrap();
