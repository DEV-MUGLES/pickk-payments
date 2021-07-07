import { PayMethod } from 'lib/pay.interface';

const {
  Card,
  Trans,
  Vbank,
  Phone,
  Samsungpay,
  Kpay,
  Kakaopay,
  Payco,
  Lpay,
  Ssgpay,
  Tosspay,
  Cultureland,
  Smartculture,
  Happymoney,
  Booknlife,
  Point,
  Naverpay,
  Chaipay,
} = PayMethod;

const PAY_METHOD_DISPLAY_NAME_MAPPER = {
  [Card]: '신용카드',
  [Trans]: '실시간계좌이체',
  [Vbank]: '가상계좌',
  [Phone]: '휴대폰소액결제',
  [Samsungpay]: '삼성페이 (이니시스, KCP 전용)',
  [Kpay]: 'KPay앱 직접호출 (이니시스 전용)',
  [Kakaopay]: '카카오페이 직접호출 (이니시스, KCP, 나이스페이먼츠 전용)',
  [Payco]: '페이코 직접호출 (이니시스, KCP 전용)',
  [Lpay]: 'LPAY 직접호출 (이니시스 전용)',
  [Ssgpay]: 'SSG페이 직접호출 (이니시스 전용)',
  [Tosspay]: '토스간편결제 직접호출 (이니시스 전용)',
  [Cultureland]: '문화상품권 (이니시스, LGU+, KCP 전용)',
  [Smartculture]: '스마트문상 (이니시스, LGU+, KCP 전용)',
  [Happymoney]: '해피머니 (이니시스, KCP 전용)',
  [Booknlife]: '도서문화상품권 (LGU+, KCP 전용)',
  [Point]: '베네피아 포인트 등 포인트 결제 (KCP 전용)',
  [Naverpay]: '네이버페이 직접호출 (이니시스 전용)',
  [Chaipay]: '차이페이 직접호출 (이니시스 전용)',
};

export const getPayMethodDisplayName = (payMethod: PayMethod): string =>
  PAY_METHOD_DISPLAY_NAME_MAPPER[payMethod];
