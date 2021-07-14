import { StdPayAuthResult, StdPayPayMethod } from 'inicis';
import dayjs from 'dayjs';

import { CompletePaymentDto } from '@src/common';

/** serialize StdAuthResult to CompletePaymentDto */
export const sar2cpd = (sar: StdPayAuthResult): CompletePaymentDto => {
  const result: CompletePaymentDto = {
    pgTid: sar.tid,
  };

  if (sar.payMethod === StdPayPayMethod.Card) {
    result.applyNum = sar.applNum;
    result.cardCode = sar.CARD_Code;
    result.cardNum = sar.CARD_Num;
  }
  if (sar.payMethod === StdPayPayMethod.VBank) {
    result.vbankCode = sar.VACT_BankCode;
    result.vbankHolder = sar.VACT_Name;
    result.vbankNum = sar.VACT_Num;
    result.vbankDate = dayjs(
      `${sar.VACT_Date}${sar.VACT_Time}`,
      'YYYYMMDDHHmmss'
    )
      .unix()
      .toString();
  }

  return result;
};
