import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { MobpayResult } from 'inicis';
import { Pg } from '@pickk/pay';

import {
  completePayment,
  decodeUrlToParams,
  encodeParamsToUrl,
  getParsedBody,
  markPaymentFailed,
  ResponseData,
} from '@src/common';
import { Inicis, mar2cpd, MobpayNoti } from '@src/pgs/inicis';

export default function InicisMobReturnPage(props: ResponseData) {
  useEffect(() => {
    const { mRedirectUrl } = props;

    if (props.success) {
      window.location.href =
        mRedirectUrl +
        '?' +
        encodeParamsToUrl({
          success: props.success,
          merchantUid: props.merchantUid,
          ...props.payment,
        });
    } else {
      window.location.href =
        mRedirectUrl + '?' + encodeParamsToUrl({ success: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return <>처리중입니다...</>;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const payResult = await getParsedBody<MobpayResult>(req);

  let props: ResponseData = null;

  try {
    // 실패했을 때
    if (payResult.P_STATUS !== '00') {
      props = await handleFail(payResult, true);
    } else {
      props = await handleSuccess(payResult);
    }
  } catch (error) {
    props = {
      success: false,
      pg: Pg.Inicis,
      errorCode: 'FAILED',
      errorMsg: 'KG이니시스: 결제처리에 실패했습니다.',
      requestId: query.requestId.toString(),
    };
  }

  const { mRedirectUrl } = decodeUrlToParams<MobpayNoti>(payResult.P_NOTI);
  props.mRedirectUrl = mRedirectUrl;
  console.log(props);
  return { props };
};

const handleFail = async (
  result: MobpayResult,
  skipNetCancel = false
): Promise<ResponseData> => {
  const { P_RMESG1: errorMsg, P_NOTI } = result;
  const { requestId, merchantUid } = decodeUrlToParams<MobpayNoti>(P_NOTI);

  if (!skipNetCancel) {
    await Inicis.mobNetCancel(
      result.P_REQ_URL,
      result.P_TID,
      result.P_AMT,
      merchantUid
    );
  }

  await markPaymentFailed(merchantUid);

  return {
    success: false,
    pg: Pg.Inicis,
    errorCode: 'CANCELLED',
    errorMsg,
    requestId,
  };
};

const handleSuccess = async (result: MobpayResult): Promise<ResponseData> => {
  try {
    const { merchantUid, requestId } = decodeUrlToParams<MobpayNoti>(
      result.P_NOTI
    );

    const authResult = await Inicis.mobAuth(result.P_REQ_URL, result.P_TID);

    if (authResult.P_STATUS !== '00') {
      console.log(authResult);
      throw new Error('Auth 처리에 실패했습니다.');
    }

    const payment = await completePayment(merchantUid, mar2cpd(authResult));

    return {
      success: true,
      pg: Pg.Inicis,
      requestId,
      merchantUid,
      payment,
    };
  } catch (error) {
    console.log(error);
    return await handleFail(result);
  }
};
