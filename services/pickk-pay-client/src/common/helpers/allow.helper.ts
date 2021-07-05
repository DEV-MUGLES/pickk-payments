import { NowRequest, NowResponse } from '@now/node';
import { MethodNotAllowedException } from '..';
import { ForbiddenException } from '../exceptions';

import { NowAsyncApiHandler } from '../types';

export const onlyAllow =
  (
    handler: NowAsyncApiHandler,
    allowOption: { methods?: string[]; ips?: string[] }
  ) =>
  async (req: NowRequest, res: NowResponse) => {
    if (allowOption.methods?.indexOf(req.method) < 0) {
      throw new MethodNotAllowedException(`Cannot ${req.method} ${req.url}`);
    }

    const ip = req.connection.remoteAddress;
    if (allowOption.ips?.indexOf(ip) < 0) {
      throw new ForbiddenException(`허용된 IP만 접근할 수 있습니다.`);
    }

    return await handler(req, res);
  };
