import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingDosisToHistoryClassification1660258346759 implements MigrationInterface {
    name = 'AddingDosisToHistoryClassification1660258346759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history_classification\` ADD \`_dosis\` bigint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history_classification\` DROP COLUMN \`_dosis\``);
    }

}
