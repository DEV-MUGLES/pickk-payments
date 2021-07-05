import { NowRequest, NowResponse } from '@now/node';
import { StdpayVbankNoti, StdpayVbankNotiWhitelist } from 'inicis';
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

const inicisStdVbankNotiHandler = async (req: NowRequest, res: NowResponse) => {
  const payload = await getParsedBody<StdpayVbankNoti>(req);

  if (payload.type_msg !== '0200') {
    const { no_tid, no_oid, nm_inputbank, nm_input } = payload;
    throw new Error(
      `정상처리되지 않은 가상계좌입금건입니다.\n(tid: ${no_tid}, oid:${no_oid}\n은행명: ${nm_inputbank}, 입금자명: ${nm_input})`
    );
  }

  const transaction = await Inicis.getTransaction(payload.no_oid);

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
  if (payload.amt_input !== transaction.price) {
    throw new BadRequestException('거래금액이 일치하지 않습니다.');
  }

  await axios.post(VBANK_NOTI_RECEIVE_URL, {
    type: 'VBANK_PAID',
    oid: payload.no_oid,
    amount: payload.amt_input,
  });
};

export default cors(
  _catch(
    onlyAllow(inicisStdVbankNotiHandler, {
      methods: ['POST'],
      ips: StdpayVbankNotiWhitelist,
    })
  )
);
