import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { PageParams } from '@common/dtos/pagination.dto';
import { parseFilter } from '@common/helpers/filter.helpers';

import { PaymentFilter } from './dtos/payment.filter';
import { Payment } from './entities/payment.entity';
import { PaymentsRepository } from './payments.repository';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsRepository)
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  async list(
    paymentFilter?: PaymentFilter,
    pageParams?: PageParams,
    relations: string[] = [],
  ): Promise<Payment[]> {
    const _paymentFilter = plainToClass(PaymentFilter, paymentFilter);
    const _pageParams = plainToClass(PageParams, pageParams);

    return await this.paymentsRepository.find({
      relations,
      where: parseFilter(_paymentFilter, _pageParams?.idFilter),
      ...(_pageParams?.pageFilter ?? {}),
    });
  }
}
