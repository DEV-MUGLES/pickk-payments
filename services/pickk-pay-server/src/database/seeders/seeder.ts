import { Injectable, Logger } from '@nestjs/common';

import { PaymentSeeder } from './payment/payment.seeder';

@Injectable()
export class Seeder {
  constructor(
    private readonly paymentSeeder: PaymentSeeder,
    private readonly logger: Logger,
  ) {}

  async seed() {
    this.logger.debug('[Payments] Start Seeding ...');
    await this.paymentSeeder.seed();
    this.logger.debug('[Payments] Seeding Complete!');
  }
}
