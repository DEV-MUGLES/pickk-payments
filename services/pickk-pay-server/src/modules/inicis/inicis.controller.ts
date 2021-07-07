import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaymentsService } from '@payments/payments.service';

import { InicisStdVbankNotiDto } from './dtos';
import { AbnormalVbankNotiException } from './exceptions';
import { StdVbankNotiGuard, MobVbankNotiGuard } from './guards';
import { InicisService } from './inicis.service';

@ApiTags('inicis')
@Controller('/inicis')
export class InicisController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService,
    @Inject(InicisService) private readonly inicisService: InicisService,
  ) {}

  // @TODO: SQS에 webhook 알림 추가하기
  @UseGuards(StdVbankNotiGuard)
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

  @UseGuards(MobVbankNotiGuard)
  @Post('/mob/vbank-noti')
  async mobVbankNoti(): Promise<string> {
    return 'hi';
  }
}
