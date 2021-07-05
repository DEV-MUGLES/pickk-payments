import { EntityRepository } from 'typeorm';

import { BaseRepository } from '@common/base.repository';

import { Payment } from './entities/payment.entity';

@EntityRepository(Payment)
export class PaymentsRepository extends BaseRepository<Payment> {}
