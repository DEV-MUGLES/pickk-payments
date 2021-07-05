import { NowRequest, NowResponse } from '@now/node';
import { MobpayVbankNoti, MobpayVbankNotiWhitelist } from 'inicis';
import axios from 'axios';

import {
  cors,
  _catch,
  onlyAllow,
  getParsedBody,
  NotFoundException,
  BadRequestException,
} from '@src/common';
import { Inicis } from '@src/pgs/inicis';

const VBANK_NOTI_RECEIVE_URL = process.env.VBANK_NOTI_RECEIVE_URL;

const inicisMobVbankNotiHandler = async (req: NowRequest, res: NowResponse) => {
  const payload = await getParsedBody<MobpayVbankNoti>(req);

  if (payload.P_STATUS !== '02') {
    throw new BadRequestException('입금되지 않은 거래건입니다.');
  }

  const transaction = await Inicis.getTransaction(payload.P_OID);

  // 거래 조회 실패함
  if (transaction.resultCode !== '00') {
    throw new Error(transaction.resultMsg);
  }
  // 해당 거래가 없음
  if (transaction.status === '9') {
    throw new NotFoundException('해당 거래를 찾을 수 없습니다.');
  }
  if (transaction.status !== 'Y') {
    throw new BadRequestException('입금완료되지 않았습니다.');
  }
  if (payload.P_AMT !== transaction.price) {
    throw new BadRequestException('거래금액이 일치하지 않습니다.');
  }

  await axios.post(VBANK_NOTI_RECEIVE_URL, {
    type: 'VBANK_PAID',
    oid: payload.P_OID,
    amount: payload.P_AMT,
  });
};

export default cors(
  _catch(
    onlyAllow(inicisMobVbankNotiHandler, {
      methods: ['POST'],
      ips: MobpayVbankNotiWhitelist,
    })
  )
);
