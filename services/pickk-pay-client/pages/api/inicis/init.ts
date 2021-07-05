import { NowRequest, NowResponse } from '@now/node';

import { cors, _catch } from '@src/common';
import { Inicis } from '@src/pgs/inicis';

const inicisInitHandler = async (req: NowRequest, res: NowResponse) => {
  const { body } = req;

  if (!body?.price) {
    res.status(400).send('Hello World!');
    return;
  }

  res.json({ ...Inicis.init(body.price) });
};

export default cors(_catch(inicisInitHandler));
