import { encodeParamsToUrl } from '@src/common';
import axios from 'axios';
import {
  IniapiGetTransactionRequestParams,
  IniapiGetTransactionResult,
  IniapiPartialRefundRequestParams,
  IniapiPartialRefundResult,
  IniapiRefundRequestParams,
  IniapiRefundResult,
} from 'inicis';

export const getTransaction = async (
  params: IniapiGetTransactionRequestParams
): Promise<IniapiGetTransactionResult> => {
  return (
    await axios.post<IniapiGetTransactionResult>(
      'https://iniapi.inicis.com/api/v1/extra?'.concat(
        encodeParamsToUrl(params)
      )
    )
  ).data;
};

export const refund = async (
  params: IniapiRefundRequestParams
): Promise<IniapiRefundResult> => {
  return (
    await axios.post<IniapiRefundResult>(
      'https://iniapi.inicis.com/api/v1/refund?'.concat(
        encodeParamsToUrl(params)
      )
    )
  ).data;
};

export const partialRefund = async (
  params: IniapiPartialRefundRequestParams
): Promise<IniapiPartialRefundResult> => {
  return (
    await axios.post<IniapiPartialRefundResult>(
      'https://iniapi.inicis.com/api/v1/refund?'.concat(
        encodeParamsToUrl(params)
      )
    )
  ).data;
};
