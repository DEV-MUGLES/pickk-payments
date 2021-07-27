import { IPayment, PayRequestParam } from '@pickk/pay';

export type InicisPrepareParam = PayRequestParam & {
  requestId: string;
} & Pick<IPayment, 'env' | 'origin'>;

export type InicisPrepareRequestDto = Pick<
  IPayment,
  | 'merchantUid'
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
  timestamp: number;
  mid: string;
  oid: string;
  mKey: string;
  signature: string;
  price: number;

  version: '1.0';
  gopaymethod: '';
  currency: 'WON';
}
