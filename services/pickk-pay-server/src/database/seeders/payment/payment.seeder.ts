import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as faker from 'faker';
import { PayMethod, Pg } from '@pickk/pay';
import { getInicisBankCodeDisplayName } from 'inicis';

import {
  getRandomEle,
  getRandomEnumValue,
  getRandomIntBetween,
} from '@common/helpers/random.helpers';

import { PaymentsRepository } from '@payments/payments.repository';
import { Payment } from '@payments/entities/payment.entity';
import { PaymentStatus } from '@payments/constants/payment.enum';
import { InicisBankCode, InicisCardCode } from 'inicis';

const PAYMENT_SEED_COUNT = 300;
faker.setLocale('ko');

@Injectable()
export class PaymentSeeder {
  constructor(
    @InjectRepository(PaymentsRepository)
    private readonly paymentsRepository: PaymentsRepository,
  ) {}

  async create(): Promise<void> {
    const payments = this.createPaymentInputs().map(
      (input) => new Payment(input),
    );
    await this.paymentsRepository.save(payments);
  }

  createPaymentInputs(): Partial<Payment>[] {
    const pg = getRandomEnumValue(Pg) as Pg;

    return [...Array(PAYMENT_SEED_COUNT)].map(() => {
      const merchantUid = 'uid_' + faker.phone.phoneNumber('##########');
      const status = getRandomEnumValue(PaymentStatus) as PaymentStatus;

      const pgTid = 'tid_' + faker.phone.phoneNumber('##########');
      const payMethod = getRandomEle([
        PayMethod.Card,
        PayMethod.Trans,
        PayMethod.Vbank,
        PayMethod.Kakaopay,
      ]);

      const buyerName = faker.name.findName();
      const buyerTel = faker.phone.phoneNumber('###########');
      const buyerEmail = faker.internet.email();
      const buyerAddr = faker.address.secondaryAddress();
      const buyerPostalcode = faker.phone.phoneNumber('#####');

      return {
        merchantUid,
        status,
        pg,
        pgTid,
        payMethod,
        name: faker.commerce.productName(),
        amount: getRandomIntBetween(5000, 150000),
        buyerName,
        buyerTel,
        buyerEmail,
        buyerAddr,
        buyerPostalcode,
        ...this.getPayMethodInput(payMethod),
        ...this.getDateInput(status),
      };
    });
  }

  private getPayMethodInput(payMethod: PayMethod): Partial<Payment> {
    if (payMethod === PayMethod.Card) {
      return {
        applyNum: faker.phone.phoneNumber('############'),
        cardCode: getRandomEnumValue(InicisCardCode) as InicisCardCode,
        cardNum: faker.phone.phoneNumber('####=####=####=####'),
      };
    }
    if (payMethod === PayMethod.Vbank) {
      const vbankCode = getRandomEnumValue(InicisBankCode) as InicisBankCode;
      return {
        vbankCode,
        vbankName: getInicisBankCodeDisplayName(vbankCode).slice(0, 15),
        vbankNum: faker.phone.phoneNumber('######-##-######'),
        vbankHolder: faker.name.findName(),
        vbankDate: faker.date.past().toString(),
      };
    }
    return {};
  }

  private getDateInput(status: PaymentStatus): Partial<Payment> {
    const { Failed, Cancelled, PartialCancelled } = PaymentStatus;

    const [createdAt, updatedAt, failedAt, paidAt, cancelledAt] = [
      faker.date.past(),
      faker.date.past(),
      faker.date.past(),
      faker.date.past(),
      faker.date.past(),
    ].sort((a, b) => a.getTime() - b.getTime());

    const result: Partial<Payment> = { createdAt, updatedAt };

    if (status === Failed) {
      result.failedAt = failedAt;
    } else {
      result.paidAt = paidAt;
    }

    if (status === Cancelled || status === PartialCancelled) {
      result.cancelledAt = cancelledAt;
    }

    return result;
  }
}