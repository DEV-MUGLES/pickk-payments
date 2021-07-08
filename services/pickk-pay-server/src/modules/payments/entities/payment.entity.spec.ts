import * as faker from 'faker';
import { PaymentStatus } from '@pickk/pay';

import { getRandomIntBetween } from '@common/helpers';
import { CancelPaymentDto } from '@payments/dtos';

import { Payment } from './payment.entity';

describe('Payment', () => {
  describe('cancel', () => {
    it('성공적으로 수행한다.', () => {
      const amount = getRandomIntBetween(1000, 100000);

      const payment = new Payment({
        cancelledAt: null,
        status: PaymentStatus.Paid,
        amount,
        cancellations: [],
      });
      const dto: CancelPaymentDto = {
        amount,
        reason: faker.lorem.text(),
        checksum: amount,
      };

      const result = payment.cancel(dto);

      delete dto.checksum;
      expect(result).toMatchObject(dto);
      expect(payment.cancelledAt).toBeTruthy();
      expect(payment.status).toEqual(PaymentStatus.Cancelled);
    });
  });
});
