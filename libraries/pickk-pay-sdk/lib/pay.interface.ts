import { InicisBankCode, InicisCardCode, MobpayRequestParams } from 'inicis';

export enum Pg {
  Inicis = 'inicis',
}

export enum PaymentStatus {
  /** 미결제 */
  Pending = 'Pending',
  /** 가상계좌 입금대기 */
  VbankReady = 'VbankReady',
  /** 결제완료 */
  Paid = 'Paid',
  /** 전액취소 */
  Cancelled = 'Cancelled',
  /** 부분취소 */
  PartialCancelled = 'PartialCancelled',
  /** 결제실패 */
  Failed = 'Failed',
}

export enum PayMethod {
  /** 신용카드 */
  Card = 'card',
  /** 실시간계좌이체 */
  Trans = 'trans',
  /** 가상계좌 */
  Vbank = 'vbank',
  /** 휴대폰소액결제 */
  Phone = 'phone',
  /** 삼성페이 (이니시스, KCP 전용) */
  Samsungpay = 'samsungpay',
  /** KPay앱 직접호출 (이니시스 전용) */
  Kpay = 'kpay',
  /** 카카오페이 직접호출 (이니시스, KCP, 나이스페이먼츠 전용) */
  Kakaopay = 'kakaopay',
  /** 페이코 직접호출 (이니시스, KCP 전용) */
  Payco = 'payco',
  /** LPAY 직접호출 (이니시스 전용) */
  Lpay = 'lpay',
  /** SSG페이 직접호출 (이니시스 전용) */
  Ssgpay = 'ssgpay',
  /** 토스간편결제 직접호출 (이니시스 전용) */
  Tosspay = 'tosspay',
  /** 문화상품권 (이니시스, LGU+, KCP 전용) */
  Cultureland = 'cultureland',
  /** 스마트문상 (이니시스, LGU+, KCP 전용) */
  Smartculture = 'smartculture',
  /** 해피머니 (이니시스, KCP 전용) */
  Happymoney = 'happymoney',
  /** 도서문화상품권 (LGU+, KCP 전용) */
  Booknlife = 'booknlife',
  /** 베네피아 포인트 등 포인트 결제 (KCP 전용) */
  Point = 'point',
  /** 네이버페이 직접호출 (이니시스 전용) */
  Naverpay = 'naverpay',
  /** 차이페이 직접호출 (이니시스 전용) */
  Chaipay = 'chaipay',
}

export type PayRequestParam = Pick<
  IPayment,
  | 'merchantUid'
  | 'pg'
  | 'payMethod'
  | 'name'
  | 'amount'
  | 'buyerName'
  | 'buyerTel'
  | 'buyerEmail'
  | 'buyerAddr'
  | 'buyerPostalcode'
> & {
  /** 모바일 결제 후 이동될 주소. 모바일 결제시에만 사용됨 */
  mRedirectUrl?: string;

  /** 결제수단
   * @default Card */
  payMethod?: PayMethod;
  /** 에스크로 결제여부
   * @default false */
  escrow?: boolean;
  /** 주문명. 원활한 결제정보확인을 위해 입력 권장
   * @default 'undefined' */
  name?: string;
  /** 결제할 금액 */
  amount: number;
  /** 주문자명
   * @default 'undefined' */
  buyerName?: string;
  /** 주문자 연락처 */
  buyerTel: string;
  /** 주문자 Email
   * @default 'undefined' */
  buyerEmail?: string;
  /** 주문자 주소
   * @default 'undefined' */
  buyerAddr?: string;
  /** 주문자 우편번호
   * @default 'undefined' */
  buyerPostalcode?: string;
  /** 가상계좌 입금기한. `YYYYMMDDhhmm` 형식 */
  vbankDue?: string;
  /** WebView 결제시 필수. ISP/앱카드 앱에서 결제정보인증 후 원래 앱으로 복귀할 때 사용됨 */
  appScheme?: string;
};

export enum PayEnviroment {
  Pc = 'Pc',
  Mobile = 'Mobile',
}

export type PayResponse = Pick<PayRequestParam, 'pg' | 'mRedirectUrl'> & {
  /** 모바일 pay(onWeb)에서 사용 */
  action?: string;
  /** 모바일 pay(onWeb)에서 사용 */
  formData?: MobpayRequestParams;
  requestId?: string;
} & (
    | {
        success: false;
        /** 에러코드. 실패시에만 반환됩니다. */
        errorCode?: string;
        /** 에러메세지. 실패시에만 반환됩니다. */
        errorMsg?: string;
      }
    | { success: true; merchantUid: string; payment: IPayment }
  );

export type PayCallback = (res: PayResponse) => void | Promise<void>;

export type PayMessage = {
  origin: string;
} & (
  | {
      action: 'payment';
      data: PayRequestParam;
      requestId: string;
    }
  | {
      action: 'done';
      data: PayResponse;
      requestId: string;
    }
  | {
      action: 'inicis.mobile';
      data: PayResponse;
    }
);

export type PayVbankNoti = {
  type: 'VBANK_PAID';
  oid: string;
  amount: number;
};

export type PayCancelRequestParam = {
  pg: Pg;
  /** pg사별 거래번호 */
  pgTid: string;

  /** 주문번호 */
  oid: string;

  /** (부분)취소요청금액 (누락 or 0원이면 전액취소) */
  amount?: number;

  /** (부분)취소요청금액 중 면세금액 (누락되면 0원처리) */
  taxFree?: number;

  /** 취소 수행 전, 현재 시점의 취소 가능한 잔액 (* 기록된 잔액과 일치하는지 사전에 검증하고, 실패하면 취소하지 않습니다. 누락되면 검증 프로세스 생략) */
  checksum: number;

  /** 취소 사유 */
  reason: string;

  /** 환불계좌 예금주 (가상계좌취소시 필수) */
  refundHolder?: string;

  /** 환불계좌 은행코드 (가상계좌취소시 필수) */
  refundBank?: InicisBankCode;

  /** 환불계좌 번호 (가상계좌취소시 필수) */
  refundAccount?: string;
};

export type PayCancelResult = Pick<
  PayCancelRequestParam,
  'pg' | 'pgTid' | 'oid' | 'amount'
> & {
  success: boolean;
};

export interface IPayment {
  /** 고유 주문번호 (PK) */
  merchantUid: string;
  createdAt: Date;
  updatedAt: Date;

  status: PaymentStatus;
  env: PayEnviroment;
  /** 결제 origin (ex: https://pickk.one/orders/sheet) */
  origin: string;

  pg: Pg;
  /** pg사 고유 거래번호 */
  pgTid: string;
  payMethod: PayMethod;

  /** 주문명 */
  name: string;
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
  vbankDate?: Date;

  cancellations?: IPaymentCancellation[];

  failedReason?: string;

  failedAt?: Date;
  paidAt?: Date;
  cancelledAt?: Date;
}

export enum PaymentCancellationType {
  Cancel = 'Cancel',
  PatialCancel = 'PatialCancel',
}

export interface IPaymentCancellation {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  type: PaymentCancellationType;
  amount: number;
  reason: string;

  /** 취소요청금액 중 면세금액
   * @default 0 */
  taxFree?: number;

  refundVbankCode?: InicisBankCode;
  refundVbankNum?: string;
  refundVbankHolder?: string;
}
