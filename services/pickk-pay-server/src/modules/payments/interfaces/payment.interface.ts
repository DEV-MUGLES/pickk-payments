import { PayMethod, Pg } from '@pickk/pay';

import { PaymentStatus } from '@payments/constants/payment.enum';
import { InicisBankCode, InicisCardCode } from 'inicis';

export interface IPayment {
  id: number;
  /** 고유 주문번호 */
  merchantUid: string;
  status: PaymentStatus;

  pg: Pg;
  /** pg사 고유 거래번호 */
  pgTid: string;
  payMethod: PayMethod;

  /** 주문명 */
  name: String;
  /** 거래 금액 */
  amount: number;

  buyerName: string;
  buyerTel: string;
  buyerEmail: string;
  buyerAddr: string;
  buyerPostalcode: string;

  /** 카드사 거래 번호 */
  applyNum?: string;
  /** 카드사 코드 */
  cardCode?: InicisCardCode;
  /** 카드 번호 */
  cardNum?: string;

  vbankCode?: InicisBankCode;
  vbankName?: string;
  vbankNum?: string;
  vbankHolder?: string;
  vbankDate?: string;

  createdAt: Date;
  updatedAt: Date;
  failedAt?: Date;
  paidAt?: Date;
  cancelledAt?: Date;
}
