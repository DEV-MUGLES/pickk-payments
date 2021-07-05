import { NowRequest, NowResponse } from '@now/node';

import { cors, onlyAllow, _catch } from '@src/common';

const getIpHandler = async (req: NowRequest, res: NowResponse) => {
  res.end(req.connection.remoteAddress);
};

export default cors(_catch(onlyAllow(getIpHandler, { methods: ['GET'] })));
