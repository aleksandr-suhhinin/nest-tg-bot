import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { engine } from 'express-handlebars';
import path, { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.engine('hbs', engine());
  app.set('view engine', 'hbs');
  const rootDir = path.resolve(__dirname, '..');
  app.setBaseViewsDir(join(rootDir, 'views'));

  await app.listen(3000);
}

bootstrap();
