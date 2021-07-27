import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Pg } from '@pickk/pay';

import { response } from '@src/common';

export default function FailPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.query.pg) {
      return;
    }

    const { pg, errorMsg, requestId } = router.query;

    response(
      'done',
      {
        success: false,
        pg: pg as Pg,
        errorMsg: errorMsg.toString(),
        requestId: requestId.toString(),
      },
      window.parent
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!router.query.pg]);

  return <></>;
}
