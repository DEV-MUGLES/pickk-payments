import { NowRequest, NowResponse } from '@now/node';

import { cors, _catch } from '@src/common';

import { Inicis } from '@src/pgs/inicis';

/** 망취소 처리용 핸들러. response schema는 StdPayNetCancelResult와 같습니다. */
const inicisStdNetCancelHandler = async (req: NowRequest, res: NowResponse) => {
  const { body } = req;

  if (!body?.url || !body?.authToken) {
    res.status(400).send('url,authToken이 누락되었습니다.');
    return;
  }

  res.json(await Inicis.stdNetCancel(body.url, body.authToken));
};

export default cors(_catch(inicisStdNetCancelHandler));
