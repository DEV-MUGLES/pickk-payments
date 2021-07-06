import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentCancellation1625564047642 implements MigrationInterface {
  name = 'AddPaymentCancellation1625564047642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `cancellation` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('cancel', 'partial_cancel') NOT NULL, `amount` int UNSIGNED NOT NULL, `reason` varchar(30) NOT NULL, `paymentId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'ALTER TABLE `cancellation` ADD CONSTRAINT `FK_688154d1673d5d413cc7df77030` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `cancellation` DROP FOREIGN KEY `FK_688154d1673d5d413cc7df77030`',
    );
    await queryRunner.query('DROP TABLE `cancellation`');
  }
}
