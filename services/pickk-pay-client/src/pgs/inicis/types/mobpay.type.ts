import { PayRequestParam } from '@pickk/pay';

export type MobpayNoti = Pick<
  PayRequestParam,
  'requestId' | 'name' | 'buyerName' | 'buyerTel' | 'oid' | 'mRedirectUrl'
>;
