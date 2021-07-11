import { INICIS_MID, INICIS_SIGNKEY } from '@inicis/constants';
import { OmitType } from '@nestjs/swagger';
import { hash, sign } from 'inicis';

import { CreatePaymentDto } from '@payments/dtos/create-payment.dto';
import { Payment } from '@payments/entities';

export class InicisPrepareRequestDto extends OmitType(CreatePaymentDto, [
  'merchantUid',
]) {}

export class InicisPrepareResponseDto {
  payment: Payment;

  timestamp: string;
  mid: string;
  mKey: string;
  signature: string;

  version = '1.0';
  gopaymethod = '';
  currency = 'WON';

  static of(payment: Payment, timestamp: string): InicisPrepareResponseDto {
    const result = new InicisPrepareResponseDto();

    result.payment = payment;

    const mKey = hash(INICIS_SIGNKEY, 'sha256');
    const signature = sign({
      oid: payment.merchantUid,
      price: payment.amount,
      timestamp,
    });

    result.timestamp = timestamp;
    result.mid = INICIS_MID;
    result.mKey = mKey;
    result.signature = signature;

    return result;
  }
}
