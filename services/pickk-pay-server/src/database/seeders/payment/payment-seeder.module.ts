import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsRepository } from '@payments/payments.repository';

import { PaymentSeeder } from './payment.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentsRepository])],
  providers: [PaymentSeeder],
  exports: [PaymentSeeder],
})
export class PaymentSeederModule {}
