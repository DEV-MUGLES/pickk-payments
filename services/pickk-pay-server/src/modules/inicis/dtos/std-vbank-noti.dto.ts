import { BadRequestException } from '@nestjs/common';
import { PaymentStatus, PayMethod, Pg } from '@pickk/pay';
import {
  IniapiGetTransactionResult,
  InicisBankCode,
  StdpayVbankNoti,
} from 'inicis';

import { isAllEleSame } from '@common/helpers';
import { Payment } from '@payments/entities';

import {
  StatusInvalidToVbankDepositException,
  VbankInvalidPricesException,
} from '../exceptions';

export class InicisStdVbankNotiDto implements StdpayVbankNoti {
  public static validate(
    dto: InicisStdVbankNotiDto,
    payment: Payment,
    transaction: IniapiGetTransactionResult,
  ): boolean {
    if (payment.pg !== Pg.Inicis) {
      throw new BadRequestException(
        '[KG이니시스 가상계좌 입금통보] 이니시스 거래건이 아닙니다.',
      );
    }
    if (payment.payMethod !== PayMethod.Vbank) {
      throw new BadRequestException(
        `[KG이니시스 가상계좌 입금통보] 가상계좌 거래건이 아닙니다. (지불수단: ${payment.payMethod})`,
      );
    }
    if (payment.status !== PaymentStatus.VbankReady) {
      throw new StatusInvalidToVbankDepositException(payment.status);
    }
    if (!isAllEleSame([dto.amt_input, payment.amount, transaction.price])) {
      throw new VbankInvalidPricesException(
        dto.amt_input,
        payment.amount,
        transaction.price,
      );
    }
    if (transaction.status !== 'Y') {
      throw new BadRequestException(
        '[KG이니시스 가상계좌 입금통보] 입금완료되지 않은 거래입니다.',
      );
    }
    return true;
  }

  no_tid: string;

  no_oid: string;

  cd_bank: InicisBankCode;

  cd_deal: InicisBankCode;

  dt_trans: string;

  tm_Trans: string;

  no_vacct: string;

  amt_input: number;

  flg_close: '0' | '1';

  cl_close: '0' | '1';

  type_msg: string;

  nm_inputbank: string;

  nm_input: string;

  dt_inputstd: string;

  dt_calculstd: string;

  dt_transbase: string;

  cl_trans: string;

  cl_kor: string;

  dt_cshr?: string;

  tm_cshr?: string;

  no_cshr_appl?: string;

  no_cshr_tid?: string;
}
