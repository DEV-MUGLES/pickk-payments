import { MobpayMethod, MobpayRequestParams } from 'inicis';
import { PayMethod } from '@pickk/pay';

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

import { requestInicisPrepare } from '../../helpers';
import { InicisPrepareParam, MobpayNoti } from '../../types';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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
  params: InicisPrepareParam
): Promise<MobpayRequestParams> => {
  const inicisParams = await requestInicisPrepare(params);

  const mobpayParams: MobpayRequestParams = {
    P_MID: inicisParams.mid,
    P_OID: inicisParams.oid,
    P_INI_PAYMENT: getMobpayMethod(params.payMethod),
    P_AMT: inicisParams.price,
    P_GOODS: params.name,
    P_UNAME: params.buyerName,
    P_MOBILE: params.buyerTel,
    P_EMAIL: params.buyerEmail,
    P_CHARSET: 'utf8',
    P_NEXT_URL: `${location.origin}/inicis/mob/return`,
    P_NOTI_URL: `${SERVER_URL}/inicis/mob/vbank-noti`,
    P_NOTI: encodeParamsToUrl({
      requestId: params.requestId,
      mRedirectUrl: params.mRedirectUrl,
      name: params.name,
      buyerName: params.buyerName,
      buyerTel: params.buyerTel,
      merchantUid: params.merchantUid,
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
  // Instagram ??? ?????? ????????? ?????????????????? Safari ??? ??????????????? Two-transaction ?????? (Two-transaction???????????? ????????? ????????? ??????)
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
