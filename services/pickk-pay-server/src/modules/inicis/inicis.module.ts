import { Module, HttpModule } from '@nestjs/common';

import { InicisController } from './inicis.controller';
import { InicisService } from './inicis.service';

@Module({
  imports: [HttpModule],
  controllers: [InicisController],
  providers: [InicisService],
  exports: [InicisService],
})
export class InicisModule {}
