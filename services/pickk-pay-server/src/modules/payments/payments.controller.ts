import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaymentListResponseDto, PaymentFilter } from './dtos';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('/payments')
export class PaymentsController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService,
  ) {}

  @ApiOperation({ description: '결제 목록을 반환합니다.' })
  @Get()
  async list(
    @Query() paymentFilter: PaymentFilter,
  ): Promise<PaymentListResponseDto> {
    const payments = await this.paymentsService.list(paymentFilter, [
      'cancellations',
    ]);
    return PaymentListResponseDto.of(payments);
  }
}
