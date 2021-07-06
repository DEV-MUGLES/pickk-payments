import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PageParams } from '@common/dtos/pagination.dto';

import { PaymentFilter } from './dtos/payment.filter';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('/payments')
export class PaymentsController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  async list(
    @Query() paymentFilter: PaymentFilter,
    @Query() pageParams: PageParams,
  ) {
    return await this.paymentsService.list(paymentFilter, pageParams);
  }
}
