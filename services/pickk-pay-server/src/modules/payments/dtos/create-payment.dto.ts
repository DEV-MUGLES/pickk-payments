import { PickType } from '@nestjs/mapped-types';

import { Payment } from '@payments/entities';

export class CreatePaymentDto extends PickType(Payment, [
  'merchantUid',
  'env',
  'origin',
  'pg',
  'payMethod',
  'name',
  'amount',
  'buyerName',
  'buyerTel',
  'buyerEmail',
  'buyerAddr',
  'buyerPostalcode',
]) {}
