import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  PaymentListResponseDto,
  PaymentFilter,
  CancelPaymentDto,
} from './dtos';
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

  @ApiOperation({ description: '지정한 결제건을 취소합니다.' })
  @Post('/:merchantUid/cancel')
  async cancel(
    @Param('merchantUid') merchantUid: string,
    @Body() cancelPaymentDto: CancelPaymentDto,
  ) {
    const payment = await this.paymentsService.findOne({ merchantUid }, [
      'cancellations',
    ]);
    await this.paymentsService.cancel(payment, cancelPaymentDto);
  }
}
