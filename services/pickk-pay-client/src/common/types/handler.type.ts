import { NowRequest, NowResponse } from '@now/node';

export type NowAsyncApiHandler = (
  req: NowRequest,
  res: NowResponse
) => Promise<void>;
