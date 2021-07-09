import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { parseFilter } from '@common/helpers';
import { InicisService } from '@inicis/inicis.service';

import { CancelPaymentDto, PaymentFilter } from './dtos';
import { Payment } from './entities';
import { PaymentsRepository } from './payments.repository';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentStatus } from '@pickk/pay';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentsRepository)
    private readonly paymentsRepository: PaymentsRepository,
    @Inject(InicisService)
    private readonly inicisService: InicisService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = new Payment({
      ...createPaymentDto,
      status: PaymentStatus.Pending,
    });
    return await this.paymentsRepository.save(payment);
  }

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

  // @TODO: 지정된 url로 webhook 발송하기
  async cancel(payment: Payment, cancelPaymentDto: CancelPaymentDto) {
    const cancellation = payment.cancel(cancelPaymentDto);

    await getManager().transaction(async (manager) => {
      await manager.save(cancellation);

      await this.inicisService.cancel({
        payment,
        ...cancelPaymentDto,
      });
    });
  }

  async confirmVbankPaid(payment: Payment): Promise<Payment> {
    payment.confirmVbankPaid();
    return await this.paymentsRepository.save(payment);
  }
}
