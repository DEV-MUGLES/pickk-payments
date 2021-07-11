import { IPayment } from '@pickk/pay';

export type InicisPrepareRequestDto = Pick<
  IPayment,
  | 'env'
  | 'origin'
  | 'pg'
  | 'payMethod'
  | 'name'
  | 'amount'
  | 'buyerName'
  | 'buyerTel'
  | 'buyerEmail'
  | 'buyerAddr'
  | 'buyerPostalcode'
>;

export class InicisPrepareResponseDto {
  payment: IPayment;

  timestamp: number;
  mid: string;
  mKey: string;
  signature: string;

  version: '1.0';
  gopaymethod: '';
  currency: 'WON';
}
