import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppConfigService } from '@config/app/config.service';

import { AppModule } from './app.module';

const APP_CONFIG_SERVICE = 'AppConfigService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const appConfig: AppConfigService = app.get(APP_CONFIG_SERVICE);
  await app.listen(appConfig.port);
}
bootstrap();
