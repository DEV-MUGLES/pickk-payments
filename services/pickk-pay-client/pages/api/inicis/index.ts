import { NowRequest, NowResponse } from '@now/node';

import {
  BadRequestException,
  cors,
  NotFoundException,
  onlyAllow,
  _catch,
} from '@src/common';
import { Inicis } from '@src/pgs/inicis';

const inicisGetTransactionHandler = async (
  req: NowRequest,
  res: NowResponse
) => {
  if (!req.query.tid || !req.query.oid) {
    throw new BadRequestException('Given invalid tid, oid');
  }

  const tid = req.query.tid.toString();
  const oid = req.query.oid.toString();
  const transaction = await Inicis.getTransaction(tid, oid);

  // 거래 조회 실패함
  if (transaction.resultCode !== '00') {
    throw new Error(transaction.resultMsg);
  }
  // 해당 거래가 없음
  if (transaction.status === '9') {
    throw new NotFoundException('해당 거래를 찾을 수 없습니다.');
  }

  res.json(transaction);
};

export default cors(
  _catch(onlyAllow(inicisGetTransactionHandler, { methods: ['GET'] }))
);
