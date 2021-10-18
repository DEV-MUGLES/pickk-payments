import { isIpad, isIphone, isMobile } from './common';
import { submitMobile } from './pgs';

import { defaultParam } from './pay.constant';
import { PayRequestParam, PayCallback, Pg, PayMessage } from './pay.interface';

const STYLESHEET_ID = 'ppay-stylesheet';
const DIALOG_ID = 'ppay-dialog';

export const INICIS_FORM_ID = 'inicis-form';

export class Pay {
  static dialog: HTMLDivElement;
  static frames: Record<
    string,
    { iframe: HTMLIFrameElement; loaded: boolean; key: string; path: string }
  > = {};
  static callbacks: Array<{ requestId: string; callback: PayCallback }> = [];

  static serviceUrl: string;

  /** 필요한 모든 sdk들을 초기화하고 load합니다. */
  static async init(serviceUrl: string) {
    if (!Pay.serviceUrl) {
      window.addEventListener('message', Pay.onMessage, false);
    }

    Pay.serviceUrl = serviceUrl;

    Pay.clear();
    Pay.createStyleSheet();
    Pay.dialog = Pay.createDialog();
    [Pg.Inicis].forEach((pg) => {
      Pay.createFrame(pg);
    });
  }

  /** 결제를 요청합니다.
   * @param param 결제 승인에 필요한 정보를 담은 Javascript 객체입니다.
   * @param cb 결제 프로세스 완료 후 호출되는 함수입니다. 해당 함수가 호출될 때 결제 결과의 정보를 담고있는 rsp객체를 인자로써 가집니다.
   */
  static request(param: Omit<PayRequestParam, 'requestId'>, cb: PayCallback) {
    if (isMobile() && !param.mRedirectUrl) {
      throw new Error('모바일환경에서 mRedirectUrl은 필수입니다.');
    }

    const _param = { ...defaultParam, ...param };
    const requestId = 'req' + new Date().getTime();
    Pay.callbacks.push({ requestId, callback: cb });

    const key = _param.pg.toLowerCase();
    const frame = Pay.frames[key];
    if (!frame?.loaded) {
      alert('결제 모듈을 불러오는 중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }

    const obj = {
      action: 'payment',
      data: { ..._param, requestId },
      origin: location.href,
      requestId,
    };
    frame.iframe.contentWindow?.postMessage(obj, Pay.serviceUrl);

    Pay.focus(key);
    Pay.open(frame.iframe);
  }

  // 이후는 모두 private function입니다.

  private static async onMessage(e: MessageEvent<PayMessage>) {
    if (e.origin !== Pay.serviceUrl) {
      return false;
    }

    const { data } = e;

    if (data.action === 'inicis.mobile') {
      data.data.formData && submitMobile(data.data.formData);
      isMobile() && Pay.close();
      return;
    }

    if (data.action === 'payment') {
      // 발생할 수 없는 case
      return;
    }

    await Pay.callbacks
      .find((cb) => cb.requestId === data.data.requestId)
      ?.callback(data.data);

    Pay.close();
    Pay.reload();
  }

  private static createStyleSheet() {
    if (document.getElementById(DIALOG_ID)) {
      return;
    }

    const headEle = document.head || document.getElementsByTagName('head')[0];
    const styleEle = document.createElement('style');
    styleEle.id = STYLESHEET_ID;

    styleEle.appendChild(
      document.createTextNode(
        "body.ppay-payment-progress {position: static}\nbody.ppay-payment-progress > :not(.ppay-dialog) {display: none}\n.ppay-dialog {display : none; position : fixed; top : 0; bottom : 0;left : 0; right : 0; width : 100%; height: 100%; z-index:99999;}\n.ppay-dialog .ppay-frame-pc.ppay-frame-danal, .ppay-dialog .ppay-frame-pc.ppay-frame-danal_tpay { left:50% !important; margin-left:-345px; width:720px !important; height:700px !important; margin-top: 50px;}\n.ppay-dialog .ppay-frame-pc.ppay-frame-mobilians { left:50% !important; margin-left:-410px; width:820px !important; height:700px !important; margin-top: 50px;}\n.ppay-dialog .ppay-header {display:none; background:transparent; position:absolute; top:0; left:0; right:0; height:25px;}\n.ppay-dialog .ppay-close {text-decoration : none; position : absolute; top : 10px; right : 10px; cursor : pointer; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAV1JREFUOBHNkz1Ow0AQhWMHioggUSFEyRGAggp6KqDhDHAFOioU/loQoqDlGhyAgmtQ0gEO31jz1iPbcZyOlUY7fvvem9mdZDD472vY0mDegrVBGaBF54qELuPYSNQkc4FjkHNCAu2JSLLkHxvsZ+Gg9FAXUw4M+CI+8zy/cuIvezQ1sx9iDOeS/YOwZT7m0VgqcITgOpwars5WOXvke9vPY8EgqVIJTxDeVXCZWWdPZLuOL9fOZ35G03tnjbyznS4zDaPNWe91iNE+hGlRFK/s74R19k0stNJ1six7w/QlqPXWAepOdWUbwDPULeKAPL7p3GGohMzqA7DzY0xvRWSfayrCCsIHBHGaKmTTr/+kQo0q1busuZl+Z+ktocrUOr2ppM3/tKY9hDiBuOfkaCa9TE8BLhyUXpxUYQSy7qiun0gh0W02wWbyYhUJgkcj7cMpRb2JsBfhNjrqBfwBsGIgzBGH3EgAAAAASUVORK5CYII=');}.ppay-dialog.popup .ppay-frame-danal-certification {background:transparent !important;}\n.ppay-dialog.pc .ppay-frame-danal-certification {width:410px !important;height:660px !important;margin:10px auto;background: #fff;}\n.ppay-dialog.pc.certification-danal {background: rgb(255, 255, 255);background: rgba(0,0,0,0.5);}\n.ppay-dialog.pc.certification-danal .ppay-header {display:block; width: 410px;margin:0 auto;}\n.ppay-dialog.pc.certification-danal.popup .ppay-header {display:none;}\n.ppay-dialog.pc.certification-danal .ppay-header .ppay-close {top:18px; right:25px; width:19px; height:19px;}\n.ppay-dialog.mobile.ios {position:absolute;}\n.ppay-dialog.mobile.certification-danal .ppay-header {display:block;}\n.ppay-dialog.mobile.certification-danal.popup .ppay-header {display:none;}\n.ppay-dialog.mobile.certification-danal .ppay-header .ppay-close {top:6px; right:10px; width:19px; height:19px;}\n.ppay-dialog.pc.payment-settle_firm {background: rgb(221, 221, 221);background: rgba(0,0,0,0.5);}\n.ppay-dialog.pc .ppay-frame-settle_firm.layer {width:410px !important;height:700px !important;margin:10px auto;background: #fff;}\n.ppay-dialog.pc.payment-kakaopay {background: rgb(221, 221, 221);background: rgba(0,0,0,0.5);}\n.ppay-dialog.pc.payment-kakaopay .ppay-frame-kakaopay {width: 426px !important; height: 550px !important; left: 50% !important; top: 50% !important; margin-left:-213px !important;margin-top: -275px !important;}\n.hide { display: none; }\n.visible { display: block; }"
      )
    );
    headEle.appendChild(styleEle);
  }

  private static createDialog(): HTMLDivElement {
    document.getElementById(DIALOG_ID)?.remove();

    const dialogEle = document.createElement('div');
    dialogEle.id = DIALOG_ID;
    dialogEle.className = `${DIALOG_ID} customizable hide`;

    const bodyEle = document.body || document.getElementsByTagName('body')[0];
    bodyEle.appendChild(dialogEle);

    return dialogEle;
  }

  // private static removeFrame(pg: Pg) {
  //   const frame = Pay.frames[pg];
  // }

  private static createFrame(pg: Pg) {
    const key = pg.toLowerCase();
    const path = Pay.path(pg);

    const WrapperFrame = document.createElement('iframe');
    WrapperFrame.src = path;
    WrapperFrame.style.width = '100%';
    WrapperFrame.style.height = '100%';
    WrapperFrame.style.border = 'none';
    WrapperFrame.style.position = 'absolute';
    WrapperFrame.style.left = '0';
    WrapperFrame.style.right = '0';
    WrapperFrame.style.top = '0';
    WrapperFrame.style.bottom = '0';
    WrapperFrame.className = [
      'ppay-frame',
      `ppay-frame-${key}`,
      'hide',
      `ppay-frame-${isMobile() ? 'mobile' : 'pc'}`,
    ].join(' ');

    Pay.frames[key] = {
      iframe: WrapperFrame,
      loaded: false,
      key,
      path,
    };

    WrapperFrame.onload = () => {
      Pay.frames[key].loaded = true;
    };

    Pay.dialog.append(WrapperFrame);

    return Pay.frames[key];
  }

  private static communicate(data: Record<string, unknown>) {
    for (const frameKey in Pay.frames) {
      const iframe = Pay.frames[frameKey].iframe;
      if (iframe.className.indexOf('visible') < 0) {
        return;
      }

      const obj = {
        action: 'communicate',
        data,
        from: 'ppay-sdk',
      };

      iframe.contentWindow?.postMessage(obj, Pay.serviceUrl);
    }
  }

  private static path(key: string) {
    return Pay.serviceUrl + `/${key}/ready`;
  }

  private static show(ele: HTMLElement) {
    ele.className = ele.className
      .split(' ')
      .filter((name) => name !== 'hide')
      .concat('visible')
      .join(' ');
    ele.style.display = 'block';
  }

  private static hide(ele: HTMLElement) {
    ele.className = ele.className
      .split(' ')
      .filter((name) => name !== 'visible')
      .concat('hide')
      .join(' ');
    ele.style.display = 'none';
  }

  private static focus(key: string) {
    for (const frameKey in Pay.frames) {
      const { iframe } = Pay.frames[frameKey];
      frameKey === key ? Pay.show(iframe) : Pay.hide(iframe);
    }
  }

  private static open(iframe: HTMLIFrameElement) {
    Pay.show(Pay.dialog);
    Pay.dialog.className = (() => {
      const classNames = [
        'ppay-dialog',
        'customizable',
        isMobile() ? 'mobile' : 'pc',
      ];

      if (isIphone() || isIpad()) {
        classNames.push('ios');
      }

      return classNames.join(' ');
    })();

    if (isMobile()) {
      document.body.classList.add('ppay-payment-progress');
      Pay.dialog.style.overflowY = '';
      Pay.dialog.removeAttribute('data-height-sync');
      iframe.style.minHeight = '';
    }
  }

  private static close() {
    Pay.hide(Pay.dialog);

    if (isMobile()) {
      document.body.classList.remove('ppay-payment-progress');
      Pay.dialog.style.overflowY = '';
      Pay.dialog.removeAttribute('data-height-sync');

      for (const frameKey in Pay.frames) {
        Pay.frames[frameKey].iframe.style.minHeight = '';
      }
    }
    return;
  }

  private static clear() {
    for (const frameKey in Pay.frames) {
      Pay.frames[frameKey].iframe.remove();
    }
    Pay.dialog?.remove();
    Pay.dialog = null;
    Pay.frames = {};
    Pay.callbacks = [];
  }

  private static reload() {
    Pay.init(Pay.serviceUrl);
  }
}
