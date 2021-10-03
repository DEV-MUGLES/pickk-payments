import axios from 'axios';
import {
  StdPayAuthInput,
  StdPayAuthResult,
  StdPayNetCancelResult,
  MobpayAuthResult,
  MobpayAuthInput,
  MobpayNetCancelInput,
  MobpayNetCancelResult,
} from 'inicis';

import {
  decodeUrlToParams,
  encodeParamsToUrl,
  getQUeryQuestionMark,
} from '@src/common';
import { InicisPrepareRequestDto, InicisPrepareResponseDto } from '../types';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const requestInicisPrepare = async (
  requestDto: InicisPrepareRequestDto
): Promise<InicisPrepareResponseDto> =>
  (
    await axios.post<InicisPrepareResponseDto>(
      `${SERVER_URL}/inicis/prepare`,
      requestDto
    )
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
): Promise<MobpayAuthResult> => {
  const { data } = await axios.post<string>(
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
  );
  return decodeUrlToParams(data);
};

export const requestInicisMobNetCancel = async (
  url: string,
  input: MobpayNetCancelInput
): Promise<MobpayNetCancelResult> => {
  const { data } = await axios.post<string>(
    url.concat(`${getQUeryQuestionMark(url)}${encodeParamsToUrl(input)}`),
    {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded', // 필수
      },
    }
  );

  return decodeUrlToParams(data);
};
