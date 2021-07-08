import { PaymentStatus } from '../../../pay.interface';

const { Ready, Paid, Cancelled, Refunded, PartialRefunded, Failed } =
  PaymentStatus;

const PAYMENT_STATUS_DISPLAY_NAME_MAPPER = {
  [Ready]: '미결제(입금대기 포함)',
  [Paid]: '결제완료',
  [Cancelled]: '취소됨',
  [Refunded]: '전액환불',
  [PartialRefunded]: '부분환불',
  [Failed]: '결제실패',
};

export const getPaymentStatusDisplayName = (status: PaymentStatus): string =>
  PAYMENT_STATUS_DISPLAY_NAME_MAPPER[status];
