import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PaymentStatus, PayMethod } from '@pickk/pay';

import { PaymentCancellation, Payment } from '../entities';
import {
  InconsistentChecksumException,
  InvalidPaymentStatusException,
  NotEnoughRemainAmountException,
  NotJoinedCancelException,
  VbankRefundInfoRequiredException,
} from '../exceptions';

export class CancelPaymentDto extends PickType(PaymentCancellation, [
  'amount',
  'reason',
  'taxFree',
  'refundVbankCode',
  'refundVbankHolder',
  'refundVbankNum',
]) {
  @ApiProperty({
    description:
      '취소 트랜잭션 수행 전, 현재시점의 취소 가능한 잔액.\n\nAPI요청자가 기록하고 있는 취소가능 잔액과 데이터베이스에 기록된 취소가능 잔액이 일치하는지 사전에 검증하고, 검증에 실패하면 트랜잭션을 수행하지 않습니다. 누락되면 검증 프로세스를 생략합니다.',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  checksum: number;

  static validate(dto: CancelPaymentDto, payment: Payment): boolean {
    if (payment.cancellations == null) {
      throw new NotJoinedCancelException();
    }

    if (payment.status !== PaymentStatus.Paid) {
      throw new InvalidPaymentStatusException(payment.status);
    }

    const {
      amount,
      checksum,
      refundVbankNum,
      refundVbankHolder,
      refundVbankCode,
    } = dto;

    if (amount > payment.remainAmount) {
      throw new NotEnoughRemainAmountException();
    }
    if (checksum !== undefined && payment.remainAmount !== checksum) {
      throw new InconsistentChecksumException();
    }
    if (payment.payMethod === PayMethod.Vbank) {
      if (!refundVbankCode || !refundVbankHolder || !refundVbankNum) {
        throw new VbankRefundInfoRequiredException();
      }
    }

    return true;
  }
}
