import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import {
  PayMethod,
  Pg,
  IPayment,
  PaymentStatus,
  PaymentCancellationType,
  PayEnviroment,
} from '@pickk/pay';
import { InicisBankCode, InicisCardCode } from 'inicis';

import { BaseIdEntity } from '@common/entities';
import { getRandomString } from '@common/helpers';

import { CancelPaymentDto } from '../dtos';
import { PaymentCancellation } from './payment-cancellation.entity';

@Entity('payment')
@Index('id_merchant-uid', ['merchantUid'])
@Index('id_pg-tid', ['pgTid'])
@Index('id_created-at', ['createdAt'])
export class Payment extends BaseIdEntity implements IPayment {
  public static genMerchantUid(
    timestamp = new Date().getTime().toString()
  ): string {
    return `${timestamp}${getRandomString(4)}`;
  }

  public get remainAmount(): number {
    return (
      this.amount -
      (this.cancellations ?? []).reduce((acc, { amount }) => acc + amount, 0)
    );
  }

  public cancel(dto: CancelPaymentDto): PaymentCancellation {
    CancelPaymentDto.validate(dto, this);

    const type =
      dto.amount === this.amount
        ? PaymentCancellationType.Cancel
        : PaymentCancellationType.PatialCancel;

    this.markCancelled(type);
    return new PaymentCancellation({ ...dto, type });
  }

  public confirmVbankPaid() {
    this.markPaid();
  }

  private markCancelled(type: PaymentCancellationType) {
    this.cancelledAt = new Date();
    this.status =
      type === PaymentCancellationType.Cancel
        ? PaymentStatus.Cancelled
        : PaymentStatus.PartialCancelled;
  }

  private markPaid() {
    this.paidAt = new Date();
    this.status = PaymentStatus.Paid;
  }

  constructor(attributes?: Partial<Payment>) {
    super(attributes);
    if (!attributes) {
      return;
    }

    this.merchantUid = attributes.merchantUid;
    this.status = attributes.status;
    this.env = attributes.env;
    this.origin = attributes.origin;
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

    this.cancellations = attributes.cancellations;
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
    enum: PayEnviroment,
  })
  @IsEnum(PayEnviroment)
  env: PayEnviroment;

  @Column()
  @IsUrl()
  origin: string;

  @Column({
    type: 'enum',
    enum: Pg,
  })
  @IsEnum(Pg)
  pg: Pg;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  pgTid: string;

  @Column({
    type: 'enum',
    enum: PayMethod,
  })
  @IsEnum(PayMethod)
  payMethod: PayMethod;

  @Column()
  @IsString()
  name: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  // 주문자 정보

  @Column({
    type: 'varchar',
    length: 20,
  })
  @IsString()
  @MaxLength(20)
  buyerName: string;

  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  @MaxLength(11)
  buyerTel: string;

  @Column()
  @IsEmail()
  buyerEmail: string;

  @Column({ type: 'char', length: 6 })
  // @TODO: https://github.com/validatorjs/validator.js/pull/1628 가 머지 및 release 완료되면 국가코드 'KR'로 변경하기!
  @IsPostalCode('DE')
  @MaxLength(6)
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
  @MaxLength(15)
  @IsOptional()
  vbankHolder?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsDateString()
  @IsOptional()
  vbankDate?: string;

  // timestamps

  @Column({ type: 'timestamp', nullable: true })
  @IsDateString()
  @IsOptional()
  failedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsDateString()
  @IsOptional()
  paidAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsDateString()
  @IsOptional()
  cancelledAt?: Date;

  @OneToMany('PaymentCancellation', 'payment', {
    cascade: true,
  })
  @JoinColumn()
  cancellations: PaymentCancellation[];
}
