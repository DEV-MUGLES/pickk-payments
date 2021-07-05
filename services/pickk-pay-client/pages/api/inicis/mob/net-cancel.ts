import { NowRequest, NowResponse } from '@now/node';

import { cors, _catch } from '@src/common';

import { Inicis } from '@src/pgs/inicis';

/** 망취소 처리용 핸들러. response schema는 MobpayNetCancelResult와 같습니다. */
const inicisMobNetCancelHandler = async (req: NowRequest, res: NowResponse) => {
  const { url, tid, amount, oid } = req.body;

  if (!url || !tid || !amount || !oid) {
    res.status(400).send('url,tid,amount,oid가 누락되었습니다.');
    return;
  }

  res.json(await Inicis.mobNetCancel(url, tid, amount, oid));
};

export default cors(_catch(inicisMobNetCancelHandler));
