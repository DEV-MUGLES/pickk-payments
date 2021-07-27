import { PayRequestParam } from '@pickk/pay';

export type MobpayNoti = Pick<
  PayRequestParam,
  'name' | 'buyerName' | 'buyerTel' | 'mRedirectUrl' | 'merchantUid'
> & {
  requestId: string;
};
