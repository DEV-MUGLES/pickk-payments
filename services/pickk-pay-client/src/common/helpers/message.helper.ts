import { PayResponse } from '@pickk/pay';

export type ResponseData = PayResponse & { requestId?: string };

export const response = (
  action: string,
  data: ResponseData,
  source: Window
) => {
  source.postMessage(
    {
      action: action,
      data: data,
    },
    '*'
  );
};
