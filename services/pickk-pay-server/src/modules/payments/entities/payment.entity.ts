import { Column, Entity, Index } from 'typeorm';
import {
  IsNumberString,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { PayMethod, Pg } from '@pickk/pay';
import { InicisBankCode, InicisCardCode } from 'inicis';

import { BaseIdEntity } from '@common/entities/base-id.entity';

import { PaymentStatus } from '@payments/constants/payment.enum';
import { IPayment } from '@payments/interfaces/payment.interface';

@Entity('payment')
@Index('id_merchant-uid', ['merchantUid'])
@Index('id_pg-tid', ['pgTid'])
export class Payment extends BaseIdEntity implements IPayment {
  @Column()
  @IsString()
  merchantUid: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: Pg,
  })
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
  buyerName: string;

  @Column({ type: 'char', length: 11 })
  @IsPhoneNumber('KR')
  @IsNumberString()
  buyerTel: string;

  @Column()
  buyerEmail: string;

  @Column({ type: 'char', length: 6 })
  // @TODO: https://github.com/validatorjs/validator.js/pull/1628 가 머지 및 release 완료되면 국가코드 'KR'로 변경하기!
  @IsPostalCode('DE')
  buyerPostalcode: string;

  @Column()
  buyerAddr: string;

  // 신용 카드 관련 정보

  @Column({ nullable: true })
  applyNum?: string;

  @Column({
    type: 'enum',
    enum: InicisCardCode,
    nullable: true,
  })
  cardCode?: InicisCardCode;

  @Column({ nullable: true })
  cardNum?: string;

  // 가상계좌 관련 정보

  @Column({
    type: 'enum',
    enum: InicisBankCode,
    nullable: true,
  })
  vbankCode?: InicisBankCode;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  vbankName?: string;

  @Column({ nullable: true })
  vbankNum?: string;

  @Column({ length: 15, nullable: true })
  vbankHolder?: string;

  @Column({ type: 'timestamp', nullable: true })
  vbankDate?: string;

  // timestamps

  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;
}
