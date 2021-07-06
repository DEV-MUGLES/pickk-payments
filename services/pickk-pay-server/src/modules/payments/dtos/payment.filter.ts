import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaymentStatus } from '@payments/constants/payment.enum';
import { IPayment } from '@payments/interfaces/payment.interface';
import { Pg } from '@pickk/pay';

export class PaymentFilter implements Partial<IPayment> {
  @ApiProperty({
    enum: Pg,
    required: false,
  })
  @IsOptional()
  @IsEnum(Pg)
  pg?: Pg;

  @ApiProperty({
    enum: PaymentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  createdAtMte?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  createdAtLte?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  merchantUidSearch?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pgTidSearch?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buyerNameSearch?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buyerEmailSearch?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buyerTel?: string;
}
