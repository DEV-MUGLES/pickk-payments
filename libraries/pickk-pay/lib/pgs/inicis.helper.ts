import { MobpayRequestParams } from 'inicis';

import { generateForm } from '../common';
import { INICIS_FORM_ID } from '../pay';

export const submitMobile = (params: MobpayRequestParams) => {
  const form = generateForm(params, INICIS_FORM_ID);

  form.action = 'https://mobile.inicis.com/smart/payment/';
  form.target = '_top';
  form.acceptCharset = 'euc-kr';

  form.submit();
  form.remove();
};
