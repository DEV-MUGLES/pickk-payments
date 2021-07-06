import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfigService } from '@config/app/config.service';

import { AppModule } from './app.module';

const APP_CONFIG_SERVICE = 'AppConfigService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PICKK Pay API docs')
    .setDescription('PICKK Payments API description')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const appConfig: AppConfigService = app.get(APP_CONFIG_SERVICE);
  await app.listen(appConfig.port);
}
bootstrap();
