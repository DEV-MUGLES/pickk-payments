import { useEffect } from 'react';

export type MessageEventListener = (e: MessageEvent) => void;

/** message EventListener를 등록합니다. */
export const useMessageListener = (listener: MessageEventListener) => {
  useEffect(() => {
    window.addEventListener('message', listener);

    return () => {
      window.removeEventListener('message', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
