import { PayRequestParam } from '@pickk/pay';

export type StdpayMerchantData = Pick<
  PayRequestParam,
  'amount' | 'userId' | 'orderSheetUuid'
> & {
  requestId: string;
  merchantUid: string;
};
