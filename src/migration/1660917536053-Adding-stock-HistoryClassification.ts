import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingStockHistoryClassification1660917536053 implements MigrationInterface {
    name = 'AddingStockHistoryClassification1660917536053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history_classification\` ADD \`_stock\` bigint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history_classification\` DROP COLUMN \`_stock\``);
    }

}
