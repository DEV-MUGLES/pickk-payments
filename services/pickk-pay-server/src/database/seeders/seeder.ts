import { Injectable, Logger } from '@nestjs/common';

import { PaymentSeeder } from './payment/payment.seeder';

@Injectable()
export class Seeder {
  constructor(
    private readonly paymentSeeder: PaymentSeeder,
    private readonly logger: Logger,
  ) {}

  async seed() {
    await this.paymentSeeder.create();
    this.logger.debug('Successfuly completed seeding payments...');
  }
}
