import Script from 'next/script';
import { isMobile, PayEnviroment, PayMessage } from '@pickk/pay';

import { useMessageListener } from '@src/common';
import { Inicis, INICIS_SDK_SCRIPT_ID } from '@src/pgs/inicis';

export default function InicisReadyPage() {
  useMessageListener(async (e: MessageEvent<PayMessage>) => {
    if (!e.data?.action) {
      return;
    }

    const { data, origin } = e;

    if (data.action !== 'payment') {
      return;
    }

    await Inicis.prepare({
      ...data.data,
      requestId: data.requestId,
      env: isMobile() ? PayEnviroment.Mobile : PayEnviroment.Pc,
      origin,
    });
    Inicis.pay(e);
  });

  return (
    <>
      <Script
        id={INICIS_SDK_SCRIPT_ID}
        type="text/javascript"
        src={Inicis.scriptUrl}
        strategy="beforeInteractive"
      />
    </>
  );
}
