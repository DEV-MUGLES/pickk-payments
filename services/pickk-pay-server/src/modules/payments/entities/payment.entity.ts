import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { PayMethod, Pg, IPayment, PaymentStatus } from '@pickk/pay';
import { InicisBankCode, InicisCardCode } from 'inicis';

import { BaseIdEntity } from '@common/entities/base-id.entity';
import { PaymentCancellation } from './payment-cancellation.entity';

@Entity('payment')
@Index('id_merchant-uid', ['merchantUid'])
@Index('id_pg-tid', ['pgTid'])
export class Payment extends BaseIdEntity implements IPayment {
  constructor(attributes?: Partial<Payment>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.merchantUid = attributes.merchantUid;
    this.status = attributes.status;
    this.pg = attributes.pg;
    this.pgTid = attributes.pgTid;
    this.payMethod = attributes.payMethod;
    this.name = attributes.name;
    this.amount = attributes.amount;
    this.buyerName = attributes.buyerName;
    this.buyerTel = attributes.buyerTel;
    this.buyerEmail = attributes.buyerEmail;
    this.buyerAddr = attributes.buyerAddr;
    this.buyerPostalcode = attributes.buyerPostalcode;
    this.applyNum = attributes.applyNum;
    this.cardCode = attributes.cardCode;
    this.cardNum = attributes.cardNum;
    this.vbankCode = attributes.vbankCode;
    this.vbankNum = attributes.vbankNum;
    this.vbankHolder = attributes.vbankHolder;
    this.failedAt = attributes.failedAt;
    this.paidAt = attributes.paidAt;
    this.cancelledAt = attributes.cancelledAt;
  }

  get remainAmount(): number {
    return (
      this.amount -
      (this.cancellations ?? []).reduce((acc, { amount }) => acc + amount, 0)
    );
  }

  @Column()
  @IsString()
  merchantUid: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: Pg,
  })
  @IsEnum(Pg)
  pg: Pg;

  @Column()
  @IsString()
  pgTid: string;

  @Column({
    type: 'enum',
    enum: PayMethod,
  })
  payMethod: PayMethod;

  @Column()
  name: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  amount: number;

  // 주문자 정보

  @Column({
    type: 'varchar',
    length: 20,
  })
  @IsString()
  buyerName: string;

  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  buyerTel: string;

  @Column()
  @IsEmail()
  buyerEmail: string;

  @Column({ type: 'char', length: 6 })
  // @TODO: https://github.com/validatorjs/validator.js/pull/1628 가 머지 및 release 완료되면 국가코드 'KR'로 변경하기!
  @IsPostalCode('DE')
  buyerPostalcode: string;

  @Column()
  @IsString()
  buyerAddr: string;

  // 신용 카드 관련 정보

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  applyNum?: string;

  @Column({
    type: 'enum',
    enum: InicisCardCode,
    nullable: true,
  })
  @IsEnum(InicisCardCode)
  @IsOptional()
  cardCode?: InicisCardCode;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  cardNum?: string;

  // 가상계좌 관련 정보

  @Column({
    type: 'enum',
    enum: InicisBankCode,
    nullable: true,
  })
  @IsEnum(InicisBankCode)
  @IsOptional()
  vbankCode?: InicisBankCode;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  vbankNum?: string;

  @Column({ length: 15, nullable: true })
  @IsString()
  @IsOptional()
  vbankHolder?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  vbankDate?: string;

  // timestamps

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  failedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  paidAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  cancelledAt?: Date;

  @OneToMany('PaymentCancellation', 'payment', {
    cascade: true,
  })
  @JoinColumn()
  cancellations: PaymentCancellation[];
}
