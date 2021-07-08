import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { IPaymentCancellation, PaymentStatus, PayMethod } from '@pickk/pay';
import { InicisBankCode } from 'inicis';

import { Payment } from '../entities';
import {
  InconsistentChecksumException,
  StatusInvalidToCancelException,
  NotEnoughRemainAmountException,
  NotJoinedCancelException,
  VbankRefundInfoRequiredException,
} from '../exceptions';

export class CancelPaymentDto
  implements
    Omit<IPaymentCancellation, 'id' | 'createdAt' | 'updatedAt' | 'type'>
{
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @MaxLength(30)
  reason: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxFree?: number;

  // 가상계좌 관련 정보

  @IsEnum(InicisBankCode)
  @IsOptional()
  refundVbankCode?: InicisBankCode;

  @IsString()
  @IsOptional()
  refundVbankNum?: string;

  @IsString()
  @MaxLength(15)
  @IsOptional()
  refundVbankHolder?: string;

  @ApiProperty({
    description:
      '취소 트랜잭션 수행 전, 현재시점의 취소 가능한 잔액.\n\nAPI요청자가 기록하고 있는 취소가능 잔액과 데이터베이스에 기록된 취소가능 잔액이 일치하는지 사전에 검증하고, 검증에 실패하면 트랜잭션을 수행하지 않습니다.',
  })
  @IsNumber()
  checksum: number;

  static validate(dto: CancelPaymentDto, payment: Payment): boolean {
    if (payment.cancellations == null) {
      throw new NotJoinedCancelException();
    }

    if (
      ![PaymentStatus.Paid, PaymentStatus.PartialCancelled].includes(
        payment.status,
      )
    ) {
      throw new StatusInvalidToCancelException(payment.status);
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
