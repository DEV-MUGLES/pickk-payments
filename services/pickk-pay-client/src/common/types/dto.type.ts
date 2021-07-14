import { IPayment } from '@pickk/pay';

export type CompletePaymentDto = Partial<
  Pick<
    IPayment,
    | 'applyNum'
    | 'cardCode'
    | 'cardNum'
    | 'vbankCode'
    | 'vbankHolder'
    | 'vbankNum'
    | 'vbankDate'
  >
> & {
  pgTid: string;
};
