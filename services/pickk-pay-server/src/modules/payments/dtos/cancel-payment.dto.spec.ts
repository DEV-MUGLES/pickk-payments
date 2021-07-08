import * as faker from 'faker';
import { PaymentStatus, PayMethod } from '@pickk/pay';

import { getRandomIntBetween } from '@common/helpers';
import { Payment } from '@payments/entities';
import {
  InconsistentChecksumException,
  NotEnoughRemainAmountException,
  NotJoinedCancelException,
  StatusInvalidToCancelException,
  VbankRefundInfoRequiredException,
} from '@payments/exceptions';

import { CancelPaymentDto } from '.';

describe('CancelPaymentDto', () => {
  describe('validate', () => {
    const amount = getRandomIntBetween(1000, 100000);
    const dto: CancelPaymentDto = {
      amount,
      reason: faker.lorem.text(),
      checksum: amount,
    };

    it('성공!', () => {
      const payment = new Payment({
        cancelledAt: null,
        status: PaymentStatus.Paid,
        amount,
        cancellations: [],
      });

      expect(CancelPaymentDto.validate(dto, payment)).toEqual(true);
    });

    it('throw NotJoinedCancelException', () => {
      const payment = new Payment();
      expect(() => CancelPaymentDto.validate(dto, payment)).toThrow(
        NotJoinedCancelException,
      );
    });

    it('throw StatusInvalidToCancelException', () => {
      const payment = new Payment({
        cancellations: [],
      });
      expect(() => CancelPaymentDto.validate(dto, payment)).toThrow(
        StatusInvalidToCancelException,
      );
    });

    it('throw NotEnoughRemainAmountException', () => {
      const payment = new Payment({
        amount: amount - 100,
        status: PaymentStatus.Paid,
        cancellations: [],
      });
      expect(() => CancelPaymentDto.validate(dto, payment)).toThrow(
        NotEnoughRemainAmountException,
      );
    });

    it('throw InconsistentChecksumException', () => {
      const payment = new Payment({
        amount,
        status: PaymentStatus.Paid,
        cancellations: [],
      });
      expect(() =>
        CancelPaymentDto.validate({ ...dto, checksum: amount - 10 }, payment),
      ).toThrow(InconsistentChecksumException);
    });

    it('throw VbankRefundInfoRequiredException', () => {
      const payment = new Payment({
        amount,
        status: PaymentStatus.Paid,
        payMethod: PayMethod.Vbank,
        cancellations: [],
      });
      expect(() => CancelPaymentDto.validate(dto, payment)).toThrow(
        VbankRefundInfoRequiredException,
      );
    });
  });
});
