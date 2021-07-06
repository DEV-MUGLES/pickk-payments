import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { parseFilter } from '@common/helpers/filter.helpers';

import { PaymentFilter } from './dtos/payment.filter';
import { Payment } from './entities/payment.entity';
import { PaymentsRepository } from './payments.repository';
import { CancelPaymentDto } from './dtos';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsRepository)
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  async findOne(
    param: Partial<Payment>,
    relations: string[] = [],
  ): Promise<Payment | null> {
    return await this.paymentsRepository.findOneEntity(param, relations);
  }

  async list(
    paymentFilter?: PaymentFilter,
    relations: string[] = [],
  ): Promise<Payment[]> {
    const _paymentFilter = plainToClass(PaymentFilter, paymentFilter);

    return await this.paymentsRepository.find({
      relations,
      where: parseFilter(_paymentFilter),
      order: {
        id: 'DESC',
      },
    });
  }

  async cancel(payment: Payment, cancelPaymentDto: CancelPaymentDto) {
    payment.cancel(cancelPaymentDto);
  }
}
