import { PartialType, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Payment } from '../entities';

export class CompletePaymentDto extends PartialType(
  PickType(Payment, [
    'applyNum',
    'cardCode',
    'cardNum',
    'vbankCode',
    'vbankHolder',
    'vbankNum',
    'vbankDate',
  ])
) {
  @IsString()
  pgTid: string;
}
