import { NowRequest, NowResponse } from '@now/node';

import { NowAsyncApiHandler } from '../types';

export const _catch =
  (handler: NowAsyncApiHandler) =>
  async (req: NowRequest, res: NowResponse) => {
    try {
      return await handler(req, res);
    } catch (err) {
      res.status(err?.code || 500).send({
        message: err?.message ?? '',
      });
    }
  };
