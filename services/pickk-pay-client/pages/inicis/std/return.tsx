import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { StdPayResult } from 'inicis';
import { Pg } from '@pickk/pay';

import {
  completePayment,
  decodeUrlToParams,
  getParsedBody,
  markPaymentFailed,
  response,
  ResponseData,
} from '@src/common';
import { Inicis, sar2cpd, StdpayMerchantData } from '@src/pgs/inicis';

export default function InicisStdReturnPage(props: ResponseData) {
  useEffect(() => {
    response('done', props, window.parent.parent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return <>처리중입니다...</>;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  try {
    const payResult = await getParsedBody<StdPayResult>(req);
    // 실패했을 때
    if (payResult.resultCode !== '0000') {
      return { props: await handleFail(payResult, true) };
    }

    return { props: await handleSuccess(payResult) };
  } catch (error) {
    return {
      props: {
        success: false,
        pg: Pg.Inicis,
        errorCode: 'FAILED',
        errorMsg: 'KG이니시스: 결제처리에 실패했습니다.',
        requestId: query.requestId,
      },
    };
  }
};

const handleFail = async (
  result: StdPayResult,
  skipNetCancel = false,
  msg?: string
): Promise<ResponseData> => {
  const { requestId, merchantUid } = decodeUrlToParams<StdpayMerchantData>(
    result.merchantData
  );

  const errorMsg = msg ?? result.resultMsg;

  if (!skipNetCancel) {
    await Inicis.stdNetCancel(result.netCancelUrl, result.authToken);
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

const handleSuccess = async (result: StdPayResult): Promise<ResponseData> => {
  try {
    const { requestId, merchantUid } = decodeUrlToParams<StdpayMerchantData>(
      result.merchantData
    );

    const authResult = await Inicis.stdAuth(result.authUrl, result.authToken);

    if (authResult.resultCode !== '0000') {
      return await handleFail(result, false, authResult.resultMsg);
    }

    const payment = await completePayment(merchantUid, sar2cpd(authResult));

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
