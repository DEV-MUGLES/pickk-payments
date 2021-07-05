import { PayMethod, PayRequestParam } from '@pickk/pay';
import {
  StdPayPayMethod,
  StdPayRequestParams,
  STDPAY_BASE_PARAMS,
} from 'inicis';

import { requestInicisInit } from '../../helpers';

const skinColor = process.env.NEXT_PUBLIC_INICIS_SKIN ?? '#C1272C';

export const getGopaymethod = (payMethod: PayMethod): StdPayPayMethod => {
  const { Card, Trans, Vbank, Phone, Kakaopay } = PayMethod;

  return (
    {
      [Card]: StdPayPayMethod.Card,
      [Trans]: StdPayPayMethod.DirectBank,
      [Vbank]: StdPayPayMethod.VBank,
      [Phone]: StdPayPayMethod.HPP,
      [Kakaopay]: StdPayPayMethod.onlykakaopay,
    }[payMethod] || StdPayPayMethod.Card
  );
};

export const serializeInicisStdpayParams = async (
  params: PayRequestParam
): Promise<StdPayRequestParams> => {
  const initParams = await requestInicisInit(params.amount);

  const stdpayParams: StdPayRequestParams = {
    ...STDPAY_BASE_PARAMS,
    ...initParams,
    gopaymethod: getGopaymethod(params.payMethod),
    goodname: params.name,
    buyername: params.buyerName,
    buyertel: params.buyerTel,
    buyeremail: params.buyerEmail,
    returnUrl: `${location.origin}/inicis/std/return?requestId=${params.requestId}`,
    closeUrl: `${location.origin}/inicis/close?pg=inicis&amount=${initParams.price}&requestId=${params.requestId}`,
    acceptmethod: `below1000:va_receipt:SKIN(${skinColor}):popreturn:HPP(2)`,
    merchantData: `${params.requestId},${initParams.price}`,
    logo_url: 'https://pay.pickk.one/images/logo.png',
  };

  if (params.payMethod === PayMethod.Kakaopay) {
    stdpayParams.acceptmethod += ':cardonly';
  }

  if (params.payMethod === PayMethod.Vbank) {
    stdpayParams.acceptmethod += `vbank(${params.vbankDue})`;
  }

  return stdpayParams;
};
