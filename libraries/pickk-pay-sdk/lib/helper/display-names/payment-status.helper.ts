import { PaymentStatus } from 'lib/pay.interface';

const { Ready, Paid, Cancelled, PartialCancelled, Failed } = PaymentStatus;

const PAYMENT_STATUS_DISPLAY_NAME_MAPPER = {
  [Ready]: '미결제',
  [Paid]: '결제완료',
  [Cancelled]: '전액취소',
  [PartialCancelled]: '부분취소',
  [Failed]: '결제실패',
};

export const getPaymentStatusDisplayName = (status: PaymentStatus): string =>
  PAYMENT_STATUS_DISPLAY_NAME_MAPPER[status];
