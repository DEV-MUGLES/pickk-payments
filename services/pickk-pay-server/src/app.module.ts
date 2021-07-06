import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AppConfigModule } from '@config/app/config.module';
import { MysqlDatabaseProviderModule } from '@providers/database/mysql/provider.module';
import { PaymentsModule } from '@payments/payments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    AppConfigModule,
    MysqlDatabaseProviderModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
