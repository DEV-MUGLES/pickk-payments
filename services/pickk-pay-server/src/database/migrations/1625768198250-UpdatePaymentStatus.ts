import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePaymentStatus1625768198250 implements MigrationInterface {
  name = 'UpdatePaymentStatus1625768198250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `status` `status` enum ('ready', 'pending', 'vbank_ready', 'paid', 'cancelled', 'partial_cancelled', 'failed') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `payment` SET status = CASE status WHEN 'ready' THEN 'vbank_ready' END WHERE status = 'ready'"
    );
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `status` `status` enum ('pending', 'vbank_ready', 'paid', 'cancelled', 'partial_cancelled', 'failed') NOT NULL"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `status` `status` enum ('ready', 'pending', 'vbank_ready', 'paid', 'cancelled', 'partial_cancelled', 'failed') NOT NULL"
    );
    await queryRunner.query(
      "UPDATE `payment` SET status = CASE status WHEN 'vbank_ready' THEN 'ready' WHEN 'pending' THEN 'ready' END WHERE status IN ('vbank_ready', 'pending')"
    );
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `status` `status` enum ('ready', 'paid', 'cancelled', 'partial_cancelled', 'failed') NOT NULL"
    );
  }
}
