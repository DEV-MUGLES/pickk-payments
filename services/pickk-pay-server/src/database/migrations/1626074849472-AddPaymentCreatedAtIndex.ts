import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentCreatedAtIndex1626074849472
  implements MigrationInterface
{
  name = 'AddPaymentCreatedAtIndex1626074849472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX `id_created-at` ON `payment` (`createdAt`)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX `id_created-at` ON `payment`');
  }
}
