import { NowRequest, NowResponse } from '@now/node';
import { PayCancelRequestParam } from '@pickk/pay';

import { cors, NotFoundException, onlyAllow, _catch } from '@src/common';
import { Inicis } from '@src/pgs/inicis';

const inicisCancelHandler = async (req: NowRequest, res: NowResponse) => {
  const { body } = req;

  const { pg, pgTid, oid, amount } = body as PayCancelRequestParam;
  // const transaction = await Inicis.getTransaction(oid);

  // // 거래 조회 실패함
  // if (transaction.resultCode !== '00') {
  //   throw new Error(transaction.resultMsg);
  // }
  // // 해당 거래가 없음
  // if (transaction.status === '9') {
  //   throw new NotFoundException('해당 거래를 찾을 수 없습니다.');
  // }

  res.end('Hello World!');
};

export default cors(
  _catch(onlyAllow(inicisCancelHandler, { methods: ['POST'] }))
);
