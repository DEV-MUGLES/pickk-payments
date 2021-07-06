import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { AppConfigModule } from '@config/app/config.module';
import { MysqlDatabaseProviderModule } from '@providers/database/mysql/provider.module';
import { PaymentsModule } from '@payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { InicisModule } from './modules/inicis/inicis.module';

@Module({
  imports: [
    AuthModule,
    AppConfigModule,
    MysqlDatabaseProviderModule,
    InicisModule,
    PaymentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
