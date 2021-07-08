import { PaymentStatus } from '../../../pay.interface';

const { Pending, VbankReady, Paid, Cancelled, PartialCancelled, Failed } =
  PaymentStatus;

const PAYMENT_STATUS_DISPLAY_NAME_MAPPER = {
  [Pending]: '미결제',
  [VbankReady]: '가상계좌 입금대기',
  [Paid]: '결제완료',
  [Cancelled]: '전액취소',
  [PartialCancelled]: '부분취소',
  [Failed]: '결제실패',
};

export const getPaymentStatusDisplayName = (status: PaymentStatus): string =>
  PAYMENT_STATUS_DISPLAY_NAME_MAPPER[status];
