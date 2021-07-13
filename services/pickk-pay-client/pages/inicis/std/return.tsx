import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { StdPayResult } from 'inicis';
import { Pg } from '@pickk/pay';

import {
  decodeUrlToParams,
  getParsedBody,
  markPaymentFailed,
  response,
  ResponseData,
} from '@src/common';
import { Inicis, StdpayMerchantData } from '@src/pgs/inicis';

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
  skipNetCancel = false
): Promise<ResponseData> => {
  const { resultMsg: errorMsg, merchantData } = result;
  const { requestId, merchantUid } =
    decodeUrlToParams<StdpayMerchantData>(merchantData);

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
    const authResult = await Inicis.stdAuth(result.authUrl, result.authToken);

    if (authResult.resultCode !== '0000') {
      throw new Error('Auth 처리에 실패했습니다.');
    }

    const { requestId } = decodeUrlToParams<StdpayMerchantData>(
      result.merchantData
    );

    return Inicis.stdComplete(authResult, requestId, {
      url: result.netCancelUrl,
      authToken: result.authToken,
    });
  } catch (error) {
    return await handleFail(result);
  }
};
