import { useEffect } from 'react';

import { useRouter } from 'next/router';

export default function InicisClosePage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.query.pg) {
      return;
    }

    const { pg, amount, requestId } = router.query;

    window.parent.location.href = `${
      location.origin
    }/fail?pg=${pg}&amount=${amount}&requestId=${requestId}&errorMsg=${encodeURIComponent(
      `사용자가 결제를 취소하셨습니다.`
    )}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!router.query.pg]);

  return <>처리중입니다...</>;
}
