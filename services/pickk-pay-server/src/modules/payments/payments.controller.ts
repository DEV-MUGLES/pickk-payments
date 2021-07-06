import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PageParams } from '@common/dtos/pagination.dto';

import { PaymentListResponseDto, PaymentFilter } from './dtos';
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
  ): Promise<PaymentListResponseDto> {
    const payments = await this.paymentsService.list(
      paymentFilter,
      pageParams,
      ['cancellations'],
    );
    return PaymentListResponseDto.of(payments);
  }
}
