import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '@payments/entities/payment.entity';

export class PaymentListResponseDto {
  @ApiProperty({
    example: { inicis: 3 },
  })
  pgCount: {
    [pgName: string]: number;
  };

  @ApiProperty({
    example: {
      card: 7,
      vbank: 5,
      trans: 0,
      kakaopay: 3,
    },
  })
  payMethodCount: {
    [payMethodName: string]: number;
  };

  @ApiProperty({
    example: {
      ready: 9,
      paid: 6,
      failed: 1,
      cancelled: 2,
      partial_cancelled: 2,
    },
  })
  statusCount: {
    [statusName: string]: number;
  };

  amounts: {
    totalPaidAmount: number;
    totalCancelledAmount: number;
  };

  payments: Payment[];
}
