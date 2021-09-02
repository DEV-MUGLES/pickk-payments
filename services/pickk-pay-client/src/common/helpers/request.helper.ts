import { IPayment } from '@pickk/pay';
import axios from 'axios';

import { CompletePaymentDto } from '../types';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const SUPER_SECRET_HEADERS = { 'super-pass': 'aMOrPhaTI1!' };

export const getClientIp = async () =>
  (await axios(`${process.env.NEXT_PUBLIC_URL}/api/ip`)).data;

export const removePayment = async (merchantUid: string) =>
  (
    await axios.delete(`${SERVER_URL}/payments/${merchantUid}`, {
      headers: SUPER_SECRET_HEADERS,
    })
  ).data;

export const markPaymentFailed = async (
  merchantUid: string
): Promise<IPayment> =>
  (
    await axios.post(`${SERVER_URL}/payments/${merchantUid}/fail`, null, {
      headers: SUPER_SECRET_HEADERS,
    })
  ).data;

export const completePayment = async (
  merchantUid: string,
  dto: CompletePaymentDto
): Promise<IPayment> =>
  (
    await axios.post(`${SERVER_URL}/payments/${merchantUid}/complete`, dto, {
      headers: SUPER_SECRET_HEADERS,
    })
  ).data;
