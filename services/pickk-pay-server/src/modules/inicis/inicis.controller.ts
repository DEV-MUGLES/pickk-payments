import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '@auth/decorators';
import { PaymentsService } from '@payments/payments.service';

import {
  InicisMobVbankNotiDto,
  InicisStdVbankNotiDto,
  InicisPrepareRequestDto,
  InicisPrepareResponseDto,
} from './dtos';
import { AbnormalVbankNotiException } from './exceptions';
import { StdVbankNotiGuard, MobVbankNotiGuard } from './guards';
import { InicisService } from './inicis.service';

@ApiTags('inicis')
@Controller('/inicis')
export class InicisController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService,
    @Inject(InicisService) private readonly inicisService: InicisService
  ) {}

  // @TODO: SQS에 webhook 알림 추가하기
  @UseGuards(StdVbankNotiGuard)
  @Public()
  @Post('/std/vbank-noti')
  async acceptStdVbankNoti(@Body() dto: InicisStdVbankNotiDto): Promise<'OK'> {
    if (dto.type_msg !== '0200') {
      throw new AbnormalVbankNotiException();
    }

    const payment = await this.paymentsService.findOne({
      merchantUid: dto.no_oid,
    });
    await this.inicisService.validateStdVbankNoti(dto, payment);
    await this.paymentsService.confirmVbankPaid(payment);
    return 'OK';
  }

  // @TODO: SQS에 webhook 알림 추가하기
  @UseGuards(MobVbankNotiGuard)
  @Public()
  @Post('/mob/vbank-noti')
  async acceptMobVbankNoti(@Body() dto: InicisMobVbankNotiDto): Promise<'OK'> {
    if (dto.P_STATUS !== '02') {
      throw new AbnormalVbankNotiException();
    }

    const payment = await this.paymentsService.findOne({
      merchantUid: dto.P_OID,
    });
    await this.inicisService.validateMobVbankNoti(dto, payment);
    await this.paymentsService.confirmVbankPaid(payment);
    return 'OK';
  }

  @Public()
  @Post('/prepare')
  async prepare(
    @Body() dto: InicisPrepareRequestDto
  ): Promise<InicisPrepareResponseDto> {
    const timestamp = new Date().getTime().toString();
    const merchantUid = await this.paymentsService.genMerchantUid(timestamp);

    const payment = await this.paymentsService.create({
      ...dto,
      merchantUid,
    });

    return InicisPrepareResponseDto.of(payment, timestamp);
  }
}
