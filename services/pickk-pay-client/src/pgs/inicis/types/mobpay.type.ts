import { PayRequestParam } from '@pickk/pay';

export type MobpayNoti = Pick<
  PayRequestParam,
  'name' | 'buyerName' | 'buyerTel' | 'oid' | 'mRedirectUrl'
> & {
  requestId: string;
};
