import { isMobile, Pg, PayMessage, formToJson, generateForm } from '@pickk/pay';
import InicisClient, {
  getRandomString,
  hash,
  IniapiCommonRequestParams,
  IniapiGetTransactionResult,
  MobpayNetCancelInput,
  sign,
} from 'inicis';
import dayjs from 'dayjs';

import { BadRequestException, getClientIp, response } from '@src/common';

import {
  serializeInicisMobpayParams,
  serializeInicisStdpayParams,
} from './serializers';
import {
  requestInicisAuth,
  requestInicisMobAuth,
  requestInicisMobNetCancel,
  requestInicisStdNetCancel,
} from './helpers';
import * as Iniapi from './helpers/iniapi-request.helper';
import { InicisPrepareParam } from './types';

const MID = process.env.NEXT_PUBLIC_INICIS_MID;
const SIGNKEY = process.env.NEXT_PUBLIC_INICIS_SIGNKEY;
const MOBILE_PRICE_HASH_KEY = process.env.NEXT_PUBLIC_MOBILE_PRICE_HASH_KEY;
const INIAPI_KEY = process.env.NEXT_PUBLIC_INICIS_INIAPI_KEY;

export const INICIS_FORM_ID = 'inicis-form';

const isValidString = (value: unknown): value is string => {
  return value != null && typeof value === 'string';
};

export class Inicis {
  static get scriptUrl() {
    return process.env.NEXT_PUBLIC_NODE_ENV === 'production'
      ? 'https://stdpay.inicis.com/stdjs/INIStdPay.js'
      : 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js';
  }

  static init(price: number) {
    if (!isValidString(MID) || !isValidString(SIGNKEY)) {
      throw new BadRequestException('이니시스 설정값들이 비어있습니다.');
    }

    return new InicisClient({
      mid: MID,
      signkey: SIGNKEY,
    }).stdpay.getParams({ price }, false);
  }

  static async prepare(param: InicisPrepareParam) {
    const inicisParam = isMobile()
      ? await serializeInicisMobpayParams(param)
      : await serializeInicisStdpayParams(param);

    generateForm(inicisParam, INICIS_FORM_ID);
  }

  static pay(e: MessageEvent<PayMessage>) {
    const form = document.getElementById(INICIS_FORM_ID) as HTMLFormElement;
    if (!form) {
      return;
    }

    if (isMobile()) {
      const { source } = e;
      const paymethod = form.P_INI_PAYMENT.value;

      response(
        'inicis.mobile',
        {
          success: false,
          action: `https://mobile.inicis.com/smart/${paymethod}/`,
          formData: formToJson(form),
          pg: Pg.Inicis,
        },
        source as Window
      );
    } else {
      window.INIStdPay.pay(INICIS_FORM_ID);
    }
  }

  private static getStdAuthMap(authToken: string) {
    const timestamp = new Date().getTime().toString();

    const signature = sign({
      authToken,
      timestamp,
    });

    return {
      mid: MID,
      authToken,
      timestamp,
      signature,
      format: 'JSON' as const,
    };
  }

  static async stdAuth(url: string, token: string) {
    return await requestInicisAuth(url, Inicis.getStdAuthMap(token));
  }

  static async mobAuth(url: string, tid: string) {
    return await requestInicisMobAuth(url, MID, tid);
  }

  static async stdNetCancel(url: string, token: string) {
    return await requestInicisStdNetCancel(url, Inicis.getStdAuthMap(token));
  }

  static async mobNetCancel(
    reqUrl: string,
    tid: string,
    amount: number,
    oid: string
  ) {
    const url = `${new URL(reqUrl).origin}/smart/payNetCancel.ini`;

    const netCancelMap: MobpayNetCancelInput = {
      P_TID: tid,
      P_AMT: amount,
      P_MID: MID,
      P_OID: oid,
    };

    if (MOBILE_PRICE_HASH_KEY) {
      const timestamp = Date.now();
      const checkfake = hash(
        `${amount}${oid}${timestamp}${MOBILE_PRICE_HASH_KEY}`,
        'sha512'
      );

      netCancelMap.P_CHKEFAKE = checkfake;
      netCancelMap.P_TIMESTAMP = timestamp;
    }

    return await requestInicisMobNetCancel(url, netCancelMap);
  }

  static async getIniapiMap(
    type: string
  ): Promise<IniapiCommonRequestParams & { tid: string }> {
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const clientIp = await getClientIp();
    const mid = MID;
    const tid = `${type.toLowerCase()}_${timestamp}_${getRandomString(4)}`;

    return {
      timestamp,
      clientIp,
      mid,
      tid,
    };
  }

  /** 주문번호 중복방지 계약을 해야 oid로만 조회 가능 */
  static async getTransaction(
    tid: string,
    oid: string
  ): Promise<IniapiGetTransactionResult> {
    const type = 'Extra';
    const paymethod = 'Inquiry';
    const iniapiMap = await Inicis.getIniapiMap(type);

    const { timestamp, clientIp } = iniapiMap;

    const hashData = hash(
      INIAPI_KEY + type + paymethod + timestamp + clientIp + MID,
      'sha512'
    );

    return await Iniapi.getTransaction({
      type,
      paymethod,
      originalTid: tid,
      oid,
      ...iniapiMap,
      hashData,
    });
  }
}
