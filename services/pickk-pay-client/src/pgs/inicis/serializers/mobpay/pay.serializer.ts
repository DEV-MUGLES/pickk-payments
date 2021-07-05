import { MobpayMethod, MobpayRequestParams } from 'inicis';
import { PayMethod, PayRequestParam } from '@pickk/pay';

import {
  encodeParamsToUrl,
  isChrome,
  isDaum,
  isFacebook,
  isFirefox,
  isInstagram,
  isKakaotalk,
  isNaver,
} from '@src/common';

import { requestInicisInit } from '../../helpers';
import { MobpayNoti } from '../../types';

const getMobpayMethod = (payMethod: PayMethod): MobpayMethod => {
  const { Card, Trans, Vbank, Phone } = PayMethod;

  return (
    {
      [Card]: MobpayMethod.CARD,
      [Trans]: MobpayMethod.BANK,
      [Vbank]: MobpayMethod.VBANK,
      [Phone]: MobpayMethod.MOBILE,
    }[payMethod] || MobpayMethod.CARD
  );
};

const getScheme = (): string => {
  if (isFirefox()) {
    return 'firefox://';
  }
  if (isChrome()) {
    return 'googlechromes://';
  }
  if (isDaum()) {
    return 'daumapps://open';
  }
  if (isFacebook()) {
    return 'fb://';
  }
  if (isNaver()) {
    return 'naversearchapp://';
  }
  if (isKakaotalk()) {
    return 'kakaotalk://';
  }
  if (isInstagram()) {
    return 'instagram://';
  }

  return null;
};

export const serializeInicisMobpayParams = async (
  params: PayRequestParam
): Promise<MobpayRequestParams> => {
  const initParams = await requestInicisInit(params.amount);

  const mobpayParams: MobpayRequestParams = {
    P_MID: initParams.mid,
    P_OID: initParams.oid,
    P_INI_PAYMENT: getMobpayMethod(params.payMethod),
    P_AMT: params.amount,
    P_GOODS: params.name,
    P_UNAME: params.buyerName,
    P_MOBILE: params.buyerTel,
    P_EMAIL: params.buyerEmail,
    P_CHARSET: 'utf8',
    P_NEXT_URL: `${location.origin}/inicis/mob/return`,
    P_NOTI_URL: `${location.origin}/api/inicis/mob/vbank-noti`,
    P_NOTI: encodeParamsToUrl({
      requestId: params.requestId,
      name: params.name,
      buyerName: params.buyerName,
      buyerTel: params.buyerTel,
      oid: initParams.oid,
      mRedirectUrl: params.mRedirectUrl,
    } as MobpayNoti),
  };

  if (
    params.payMethod === PayMethod.Vbank &&
    typeof params.vbankDue === 'string'
  ) {
    const due = params.vbankDue.replace(/\D/g, '');

    if (due.length < 8) {
      return;
    }

    mobpayParams.P_VBANK_DT = due.substr(0, 8);

    let hhmm = due.substr(8, 4);
    if (!hhmm) {
      return;
    }
    hhmm = hhmm + '0000'.substr(0, 4 - hhmm.length);
    mobpayParams.P_VBANK_TM = hhmm;
  }

  const reservedParams = {
    below1000: 'Y',
    vbank_receipt: 'Y',
    global_visa3d: 'Y',
  };

  const scheme = getScheme();
  // Instagram 은 웹뷰 복귀가 불가능하므로 Safari 로 랜딩시키고 Two-transaction 안함 (Two-transaction옵션주면 결제창 동작을 안함)
  if (scheme !== 'instagram://') {
    reservedParams['twotrs_isp'] = 'Y';
    reservedParams['block_isp'] = 'Y';
    reservedParams['twotrs_kpay'] = 'Y';
    if (scheme) {
      reservedParams['app_scheme'] = scheme;
    }
  }

  if (params.payMethod === PayMethod.Kakaopay) {
    reservedParams['d_kakaopay'] = 'Y';
  }
  if (params.payMethod === PayMethod.Ssgpay) {
    reservedParams['d_ssgpay'] = 'Y';
  }
  if (params.payMethod === PayMethod.Tosspay) {
    reservedParams['d_tosspay'] = 'Y';
  }

  mobpayParams.P_RESERVED = encodeParamsToUrl(reservedParams);

  return mobpayParams;
};
