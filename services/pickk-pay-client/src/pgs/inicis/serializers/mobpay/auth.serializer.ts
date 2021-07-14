import { MobpayAuthResult, MobpayMethod } from 'inicis';
import dayjs from 'dayjs';

import { CompletePaymentDto } from '@src/common';

/** serialize MobpayAuthResult to CompletePaymentDto */
export const mar2cpd = (mar: MobpayAuthResult): CompletePaymentDto => {
  const result: CompletePaymentDto = {
    pgTid: mar.P_TID,
  };

  if (mar.P_TYPE === MobpayMethod.CARD) {
    result.applyNum = mar.P_AUTH_NO;
    result.cardCode = mar.P_FN_CD1;
    result.cardNum = mar.P_CARD_NUM;
  }
  if (mar.P_TYPE === MobpayMethod.VBANK) {
    result.vbankCode = mar.P_VACT_BANK_CODE;
    result.vbankHolder = mar.P_VACT_NAME;
    result.vbankNum = mar.P_VACT_NUM;
    result.vbankDate = dayjs(
      `${mar.P_VACT_DATE}${mar.P_VACT_TIME}`,
      'YYYYMMDDHHmmss'
    )
      .unix()
      .toString();
  }

  return result;
};
