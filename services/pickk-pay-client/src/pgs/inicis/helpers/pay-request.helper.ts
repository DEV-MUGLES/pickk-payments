import axios from 'axios';
import {
  StdPayRequestParams,
  StdPayAuthInput,
  StdPayAuthResult,
  StdPayNetCancelResult,
  MobpayAuthResult,
  MobpayAuthInput,
  MobpayNetCancelInput,
  MobpayNetCancelResult,
} from 'inicis';

import { encodeParamsToUrl, getQUeryQuestionMark } from '@src/common';

export type InicisInitParam = Pick<
  StdPayRequestParams,
  'price' | 'mid' | 'oid' | 'timestamp' | 'mKey' | 'signature'
>;

export const requestInicisInit = async (
  price: number
): Promise<InicisInitParam> =>
  (
    await axios.post<InicisInitParam>(`${location.origin}/api/inicis/init`, {
      price,
    })
  ).data;

export type InicisAuthInput = Pick<
  StdPayAuthInput,
  'mid' | 'authToken' | 'timestamp' | 'charset' | 'price' | 'charset' | 'format'
> & {
  signature: string;
};

export const requestInicisAuth = async (
  url: string,
  input: InicisAuthInput
): Promise<StdPayAuthResult> =>
  (
    await axios.post<StdPayAuthResult>(
      url.concat(`${getQUeryQuestionMark(url)}${encodeParamsToUrl(input)}`),
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded', // 필수
        },
      }
    )
  ).data;

export const requestInicisStdNetCancel = async (
  url: string,
  input: InicisAuthInput
): Promise<StdPayNetCancelResult> =>
  (
    await axios.post<StdPayNetCancelResult>(
      url.concat(`${getQUeryQuestionMark(url)}${encodeParamsToUrl(input)}`),
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded', // 필수
        },
      }
    )
  ).data;

export const requestInicisMobAuth = async (
  url: string,
  mid: string,
  tid: string
): Promise<MobpayAuthResult> =>
  (
    await axios.post<MobpayAuthResult>(
      url.concat(
        `${getQUeryQuestionMark(url)}${encodeParamsToUrl({
          P_MID: mid,
          P_TID: tid,
        } as MobpayAuthInput)}`
      ),
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded', // 필수
        },
      }
    )
  ).data;

export const requestInicisMobNetCancel = async (
  url: string,
  input: MobpayNetCancelInput
): Promise<MobpayNetCancelResult> =>
  (
    await axios.post<MobpayNetCancelResult>(
      url.concat(`${getQUeryQuestionMark(url)}${encodeParamsToUrl(input)}`),
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded', // 필수
        },
      }
    )
  ).data;
