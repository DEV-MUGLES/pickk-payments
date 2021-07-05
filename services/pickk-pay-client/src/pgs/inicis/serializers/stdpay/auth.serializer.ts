import dayjs from 'dayjs';
import { PayMethod, PayResponse, Pg } from '@pickk/pay';
import { InicisSourceCode, StdPayAuthResult, StdPayPayMethod } from 'inicis';

export const getStdPaymethod = (authResult: StdPayAuthResult) => {
  if (authResult.payMethod === StdPayPayMethod.Card) {
    const {
      KakaoPay,
      Payco,
      LPay,
      SsgPay,
      TossPay,
      NaverPay,
      SamsungPay,
      KPay,
      ChaiPay,
    } = InicisSourceCode;

    const { CARD_SrcCode: srcCode, CARD_CouponPrice: couponPrice } = authResult;

    // 간편결제 자체 포인트 100% 결제시 'point' 반환
    if (couponPrice === 0) {
      return PayMethod.Point;
    }

    return (
      {
        [KakaoPay]: PayMethod.Kakaopay,
        [Payco]: PayMethod.Payco,
        [LPay]: PayMethod.Lpay,
        [SsgPay]: PayMethod.Ssgpay,
        [TossPay]: PayMethod.Tosspay,
        [NaverPay]: PayMethod.Naverpay,
        [SamsungPay]: PayMethod.Samsungpay,
        [KPay]: PayMethod.Kpay,
        [ChaiPay]: PayMethod.Chaipay,
      }[srcCode] ?? PayMethod.Card
    );
  }

  const { Card, DirectBank, VBank, HPP } = StdPayPayMethod;

  return (
    {
      [Card]: PayMethod.Card,
      [DirectBank]: PayMethod.Trans,
      [VBank]: PayMethod.Vbank,
      [HPP]: PayMethod.Phone,
    }[authResult.payMethod] ?? PayMethod.Card
  );
};

export const stdAuthResultToPayResponse = (
  result: StdPayAuthResult,
  netCancelData: PayResponse['netCancelData']
): PayResponse => {
  const payResponse: PayResponse = {
    success: true,
    pg: Pg.Inicis,
    payMethod: getStdPaymethod(result),
    oid: result.tid,
    amount: result.TotPrice,
    name: result.goodName,
    buyerName: result.buyerName,
    buyerTel: result.buyerTel,
    buyerEmail: result.buyerEmail,
    applyNum: result.applNum,
    paidAt: dayjs(
      `${result.applDate}${result.applTime}`,
      'YYYYMMDDHHmmss'
    ).unix(),
    netCancelData,
  };

  if (result.payMethod === StdPayPayMethod.VBank) {
    payResponse.vbankNum = result.VACT_Num;
    payResponse.vbankName = result.vactBankName;
    payResponse.vbankHolder = result.VACT_Name;
    payResponse.vbankSender = result.VACT_InputName;
    payResponse.vbankDate = dayjs(
      `${result.VACT_Date}${result.VACT_Time}`,
      'YYYYMMDDHHmmss'
    ).unix();
  }

  return payResponse;
};
