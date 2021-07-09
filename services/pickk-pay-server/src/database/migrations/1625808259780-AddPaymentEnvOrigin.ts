import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentEnvOrigin1625808259780 implements MigrationInterface {
  name = 'AddPaymentEnvOrigin1625808259780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `payment` CHANGE `pgTid` `pgTid` varchar(255) NULL',
    );

    // 일단 nullable로 추가
    await queryRunner.query(
      "ALTER TABLE `payment` ADD `env` enum ('pc', 'mobile') NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `payment` ADD `origin` varchar(255) NULL',
    );
    // 값 채우기
    await queryRunner.query(
      "UPDATE `payment` SET env = 'pc', origin = 'https://pickk.one/orders/sheet'",
    );
    // NOT NULL로 변경
    await queryRunner.query(
      "ALTER TABLE `payment` CHANGE `env` `env` enum ('pc', 'mobile') NOT NULL",
    );
    await queryRunner.query(
      'ALTER TABLE `payment` CHANGE `origin` `origin` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `payment` DROP COLUMN `origin`');
    await queryRunner.query('ALTER TABLE `payment` DROP COLUMN `env`');
    await queryRunner.query(
      'ALTER TABLE `payment` CHANGE `pgTid` `pgTid` varchar(255) NOT NULL',
    );
  }
}
