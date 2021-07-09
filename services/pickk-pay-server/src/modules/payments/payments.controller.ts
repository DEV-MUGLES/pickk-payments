import { SuperSecret } from '@auth/decorators';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  PaymentListResponseDto,
  PaymentFilter,
  CancelPaymentDto,
} from './dtos';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { Payment } from './entities';
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

  @ApiOperation({ description: '[SuperSecret] 새로운 결제건을 생성합니다.' })
  @SuperSecret()
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return await this.paymentsService.create(createPaymentDto);
  }

  @ApiOperation({ description: '[SuperSecret] 결제건을 수정합니다.' })
  @SuperSecret()
  @Patch('/:merchantUid')
  async update(
    @Param('merchantUid') merchantUid: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.paymentsService.findOne({ merchantUid }, [
      'cancellations',
    ]);
    return await this.paymentsService.update(payment, updatePaymentDto);
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
