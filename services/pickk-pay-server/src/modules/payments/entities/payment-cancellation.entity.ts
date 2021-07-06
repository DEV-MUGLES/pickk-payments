import { Column, Entity, ManyToOne } from 'typeorm';
import { IPaymentCancellation, PaymentCancellationType } from '@pickk/pay';

import { BaseIdEntity } from '@common/entities/base-id.entity';
import { Payment } from './payment.entity';

@Entity('cancellation')
export class PaymentCancellation
  extends BaseIdEntity
  implements IPaymentCancellation
{
  constructor(attributes?: Partial<PaymentCancellation>) {
    super(attributes);
    if (!attributes) {
      return;
    }
  }

  @Column({
    type: 'enum',
    enum: PaymentCancellationType,
  })
  type: PaymentCancellationType;

  @Column({
    type: 'int',
    unsigned: true,
  })
  amount: number;

  @Column({ length: 30 })
  reason: string;

  @ManyToOne('Payment', 'cancellations', {
    onDelete: 'CASCADE',
  })
  payment: Payment;
}
