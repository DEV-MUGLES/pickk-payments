import { PayMethod, PayRequestParam } from './pay.interface';

// oid default값은 pg별 로직에서 부여한다.
export const defaultParam: Required<
  Pick<
    PayRequestParam,
    | 'payMethod'
    | 'escrow'
    | 'name'
    | 'buyerName'
    | 'buyerEmail'
    | 'buyerAddr'
    | 'buyerPostalcode'
  >
> = {
  payMethod: PayMethod.Card,
  escrow: false,
  name: 'undefined',
  buyerName: 'undefined',
  buyerEmail: 'undefined',
  buyerAddr: 'undefined',
  buyerPostalcode: 'undefined',
};
