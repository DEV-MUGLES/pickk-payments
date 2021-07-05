import dayjs from 'dayjs';
import { PayMethod, Pg } from '@pickk/pay';
import { InicisSourceCode, MobpayAuthResult, MobpayMethod } from 'inicis';

import { decodeUrlToParams, ResponseData } from '@src/common';

import { MobpayNoti } from '../../types';

export const getMobPaymethod = (authResult: MobpayAuthResult): PayMethod => {
  if (authResult.P_TYPE === MobpayMethod.CARD) {
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

    const { P_SRC_CODE: srcCode, P_CARD_APPLPRICE: couponPrice } = authResult;

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

  const { CARD, BANK, VBANK, MOBILE } = MobpayMethod;

  return (
    {
      [CARD]: PayMethod.Card,
      [BANK]: PayMethod.Trans,
      [VBANK]: PayMethod.Vbank,
      [MOBILE]: PayMethod.Phone,
    }[authResult.P_TYPE] ?? PayMethod.Card
  );
};

export const mobAuthResultToResponseData = (
  result: MobpayAuthResult
): ResponseData => {
  const { requestId, name, buyerName, buyerTel } =
    decodeUrlToParams<MobpayNoti>(result.P_NOTI);

  const responseData: ResponseData = {
    success: true,
    pg: Pg.Inicis,
    payMethod: getMobPaymethod(result),
    oid: result.P_OID,
    amount: result.P_AMT,
    name,
    buyerName,
    buyerTel,
    paidAt: dayjs(`${result.P_AUTH_DT}`, 'YYYYMMDDHHmmss').unix(),
    requestId,
  };

  if (result.P_TYPE === MobpayMethod.VBANK) {
    responseData.vbankNum = result.P_VACT_NUM;
    responseData.vbankName = result.P_FN_NM;
    responseData.vbankHolder = result.P_VACT_NAME;
    responseData.vbankSender = result.P_VACT_NAME;
    responseData.vbankDate = dayjs(
      `${result.P_VACT_DATE}${result.P_VACT_TIME}`,
      'YYYYMMDDHHmmss'
    ).unix();
  }

  return responseData;
};
