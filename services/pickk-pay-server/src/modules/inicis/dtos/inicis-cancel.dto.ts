import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { InicisBankCode } from 'inicis';

import { Payment } from '@payments/entities';

export class InicisCancelDto {
  payment: Payment;

  @IsNumber()
  amount: number;

  @IsString()
  reason: string;

  @IsNumber()
  @IsOptional()
  taxFree?: number;

  @IsEnum(InicisBankCode)
  @IsOptional()
  refundVbankCode?: InicisBankCode;

  @IsString()
  @IsOptional()
  refundVbankNum?: string;

  @IsString()
  @IsOptional()
  refundVbankHolder?: string;
}
