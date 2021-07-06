import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1625571320230 implements MigrationInterface {
  name = 'InitialMigration1625571320230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `payment` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `merchantUid` varchar(255) NOT NULL, `status` enum ('ready', 'paid', 'cancelled', 'partial_cancelled', 'failed') NOT NULL, `pg` enum ('inicis') NOT NULL, `pgTid` varchar(255) NOT NULL, `payMethod` enum ('card', 'trans', 'vbank', 'phone', 'samsungpay', 'kpay', 'kakaopay', 'payco', 'lpay', 'ssgpay', 'tosspay', 'cultureland', 'smartculture', 'happymoney', 'booknlife', 'point', 'naverpay', 'chaipay') NOT NULL, `name` varchar(255) NOT NULL, `amount` int UNSIGNED NOT NULL, `buyerName` varchar(20) NOT NULL, `buyerTel` char(11) NOT NULL, `buyerEmail` varchar(255) NOT NULL, `buyerPostalcode` char(6) NOT NULL, `buyerAddr` varchar(255) NOT NULL, `applyNum` varchar(255) NULL, `cardCode` enum ('01', '03', '04', '06', '11', '12', '14', '15', '16', '17', '21', '22', '23', '24', '25', '91', '93', '94', '96', '97', '98') NULL, `cardNum` varchar(255) NULL, `vbankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NULL, `vbankNum` varchar(255) NULL, `vbankHolder` varchar(15) NULL, `vbankDate` timestamp NULL, `failedAt` timestamp NULL, `paidAt` timestamp NULL, `cancelledAt` timestamp NULL, INDEX `id_pg-tid` (`pgTid`), INDEX `id_merchant-uid` (`merchantUid`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `cancellation` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('cancel', 'partial_cancel') NOT NULL, `amount` int UNSIGNED NOT NULL, `reason` varchar(30) NOT NULL, `taxFree` int UNSIGNED NOT NULL DEFAULT '0', `refundVbankCode` enum ('02', '03', '04', '05', '06', '07', '11', '12', '16', '20', '21', '22', '23', '24', '25', '26', '27', '31', '32', '34', '35', '37', '38', '39', '41', '48', '50', '53', '54', '55', '56', '57', '59', '60', '64', '70', '71', '81', '83', '87', '88', '89', '90', '91', '93', '94', '96', '97', '98') NULL, `refundVbankNum` varchar(255) NULL, `refundVbankHolder` varchar(15) NULL, `paymentId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
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
    await queryRunner.query('DROP INDEX `id_merchant-uid` ON `payment`');
    await queryRunner.query('DROP INDEX `id_pg-tid` ON `payment`');
    await queryRunner.query('DROP TABLE `payment`');
  }
}
