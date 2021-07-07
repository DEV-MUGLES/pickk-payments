import { ApiProperty } from '@nestjs/swagger';
import { Pg, PaymentStatus, PayMethod } from '@pickk/pay';

import { Payment } from '../entities';

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

  public static of(payments: Payment[]): PaymentListResponseDto {
    const result = new PaymentListResponseDto();

    const pgCount = {
        [Pg.Inicis]: 0,
      },
      statusCount = {
        [PaymentStatus.Ready]: 0,
        [PaymentStatus.Paid]: 0,
        [PaymentStatus.Failed]: 0,
        [PaymentStatus.Cancelled]: 0,
        [PaymentStatus.PartialCancelled]: 0,
      },
      payMethodCount = {
        [PayMethod.Card]: 0,
        [PayMethod.Vbank]: 0,
        [PayMethod.Trans]: 0,
        [PayMethod.Kakaopay]: 0,
      },
      amounts = {
        totalPaidAmount: 0,
        totalCancelledAmount: 0,
      };

    payments.forEach((payment) => {
      const { pg, status, payMethod, amount } = payment;

      pgCount[pg] ? (pgCount[pg] += 1) : (pgCount[pg] = 1);
      statusCount[status]
        ? (statusCount[status] += 1)
        : (statusCount[status] = 1);
      payMethodCount[payMethod]
        ? (payMethodCount[payMethod] += 1)
        : (payMethodCount[payMethod] = 1);

      const { Ready, Failed, Cancelled, PartialCancelled } = PaymentStatus;

      if (status !== Ready && status !== Failed) {
        amounts.totalPaidAmount += amount;
      }

      if (status === Cancelled || status === PartialCancelled) {
        amounts.totalCancelledAmount += amount;
      }
    });

    result.pgCount = pgCount;
    result.payMethodCount = payMethodCount;
    result.statusCount = statusCount;
    result.amounts = amounts;
    result.payments = payments;

    return result;
  }
}
