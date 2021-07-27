import { PayRequestParam } from '@pickk/pay';

export type StdpayMerchantData = Pick<PayRequestParam, 'amount'> & {
  requestId: string;
  merchantUid: string;
};
