import { useEffect } from 'react';
import { GetServerSideProps } from 'next';

import { removePayment } from '@src/common';

type InicisClosePageProps = {
  querystring: string;
};

export default function InicisClosePage({ querystring }: InicisClosePageProps) {
  useEffect(() => {
    window.parent.location.href = `${location.origin}/fail${querystring}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>처리중입니다...</>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { pg, amount, requestId, merchantUid } = query;

  await removePayment(merchantUid.toString());

  return {
    props: {
      querystring: `?pg=${pg}&amount=${amount}&requestId=${requestId}&errorMsg=${encodeURIComponent(
        '사용자가 결제를 취소하셨습니다.'
      )}`,
    },
  };
};
