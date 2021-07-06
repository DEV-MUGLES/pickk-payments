import { Logger, Module } from '@nestjs/common';

import { Seeder } from './seeder';
import { PaymentSeederModule } from './payment/payment-seeder.module';
import { MysqlDatabaseProviderModule } from '@providers/database/mysql/provider.module';

@Module({
  imports: [MysqlDatabaseProviderModule, PaymentSeederModule],
  providers: [Seeder, Logger],
})
export class SeederModule {}
