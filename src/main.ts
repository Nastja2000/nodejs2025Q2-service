import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docsFilePath = join(__dirname, '..', 'doc', 'api.yaml');
  const file = await readFile(docsFilePath, 'utf-8');
  const apiDoc = parse(file);
  
  SwaggerModule.setup('doc', app, apiDoc);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(PORT);
}
bootstrap();
