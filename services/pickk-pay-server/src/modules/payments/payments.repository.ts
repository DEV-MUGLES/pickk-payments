import { EntityRepository } from 'typeorm';

import { BaseRepository } from '@common/base.repository';

import { Payment } from './entities';

@EntityRepository(Payment)
export class PaymentsRepository extends BaseRepository<Payment> {
  async checkExist(merchantUid: string): Promise<boolean> {
    const result = await this.createQueryBuilder('payment')
      .select('1')
      .where('payment.merchantUid = :merchantUid', { merchantUid })
      .take(1)
      .limit(1)
      .execute();
    return result?.length > 0;
  }
}
