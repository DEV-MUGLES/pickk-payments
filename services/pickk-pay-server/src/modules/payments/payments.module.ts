import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsRepository])],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
