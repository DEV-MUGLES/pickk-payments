import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const MAIN_SERVER_URL = process.env.MAIN_SERVER_URL;

const SUPER_SECRET_HEADERS = { 'super-pass': 'aMOrPhaTI1!' };

export const getClientIp = async () =>
  (await axios(`${process.env.NEXT_PUBLIC_URL}/api/ip`)).data;

export const removePayment = async (merchantUid: string) =>
  (
    await axios.delete(`${SERVER_URL}/payments/${merchantUid}`, {
      headers: SUPER_SECRET_HEADERS,
    })
  ).data;

export const markPaymentFailed = async (merchantUid: string) =>
  (
    await axios.post(`${SERVER_URL}/payments/${merchantUid}/fail`, {
      headers: SUPER_SECRET_HEADERS,
    })
  ).data;

export const prepareOrder = async (userId: number, orderSheetUuid: string) =>
  (
    await axios.post(`${MAIN_SERVER_URL}/graphql`, {
      query: `
        mutation prepareOrder {
          prepareOrder(userId: ${userId}, orderSheetUuid: ${orderSheetUuid})
        }
      `,
    })
  ).data;
