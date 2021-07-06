import { Column, Entity, ManyToOne } from 'typeorm';
import { IPaymentCancellation, PaymentCancellationType } from '@pickk/pay';
import { InicisBankCode } from 'inicis';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { BaseIdEntity } from '@common/entities/base-id.entity';
import { Payment } from './payment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cancellation')
export class PaymentCancellation
  extends BaseIdEntity
  implements IPaymentCancellation
{
  constructor(attributes?: Partial<PaymentCancellation>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.type = attributes.type;
    this.amount = attributes.amount;
    this.reason = attributes.reason;
    this.taxFree = attributes.taxFree;
    this.refundVbankCode = attributes.refundVbankCode;
    this.refundVbankHolder = attributes.refundVbankHolder;
    this.refundVbankNum = attributes.refundVbankNum;
  }

  @Column({
    type: 'enum',
    enum: PaymentCancellationType,
  })
  @IsEnum(PaymentCancellationType)
  type: PaymentCancellationType;

  @Column({
    type: 'int',
    unsigned: true,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @Column({ length: 30 })
  @IsString()
  @MaxLength(30)
  reason: string;

  @ManyToOne('Payment', 'cancellations', {
    onDelete: 'CASCADE',
  })
  payment: Payment;

  @ApiProperty({
    description: '취소요청금액 중 면세금액(누락되면 0원처리)',
    required: false,
  })
  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxFree?: number;

  // 가상계좌 관련 정보

  @Column({
    type: 'enum',
    enum: InicisBankCode,
    nullable: true,
  })
  @IsEnum(InicisBankCode)
  @IsOptional()
  refundVbankCode?: InicisBankCode;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  refundVbankNum?: string;

  @Column({ length: 15, nullable: true })
  @IsString()
  @MaxLength(15)
  @IsOptional()
  refundVbankHolder?: string;
}
