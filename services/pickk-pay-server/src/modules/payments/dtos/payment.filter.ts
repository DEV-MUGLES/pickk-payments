import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PayMethod, Pg, PaymentStatus, IPayment } from '@pickk/pay';

export class PaymentFilter implements Partial<IPayment> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  merchantUid?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pgTid?: string;

  @ApiProperty({
    type: [Pg],
    required: false,
  })
  @IsOptional()
  @IsEnum(Pg, { each: true })
  pgIn?: Pg[];

  @ApiProperty({
    type: [PayMethod],
    required: false,
  })
  @IsOptional()
  @IsEnum(PayMethod, { each: true })
  payMethodIn?: PayMethod[];

  @ApiProperty({
    type: [PaymentStatus],
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus, { each: true })
  statusIn?: PaymentStatus[];

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
  buyerTelSearch?: string;
}
