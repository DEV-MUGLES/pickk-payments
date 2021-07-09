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
    .setDescription(
      'healthcheck, signin을 제외 모든 엔드포인트가 Bearer token 인증을 사용합니다.',
    )
    .setVersion('0.0.18')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const appConfig: AppConfigService = app.get(APP_CONFIG_SERVICE);
  await app.listen(appConfig.port);
}
bootstrap();
