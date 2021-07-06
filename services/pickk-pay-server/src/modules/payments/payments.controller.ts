import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PayMethod, Pg, PaymentStatus } from '@pickk/pay';

import { PageParams } from '@common/dtos/pagination.dto';

import { PaymentListResponseDto, PaymentFilter } from './dtos';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('/payments')
export class PaymentsController {
  constructor(
    @Inject(PaymentsService) private readonly paymentsService: PaymentsService,
  ) {}

  @Get()
  async list(
    @Query() paymentFilter: PaymentFilter,
    @Query() pageParams: PageParams,
  ): Promise<PaymentListResponseDto> {
    const payments = await this.paymentsService.list(
      paymentFilter,
      pageParams,
      ['cancellations'],
    );
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
      };
    const amounts = {
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

    return {
      pgCount,
      statusCount,
      payMethodCount,
      amounts,
      payments,
    };
  }
}
