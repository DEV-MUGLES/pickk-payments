import { Module } from '@nestjs/common';

import { InicisController } from './inicis.controller';
import { InicisService } from './inicis.service';

@Module({
  controllers: [InicisController],
  providers: [InicisService],
  exports: [InicisService],
})
export class InicisModule {}
