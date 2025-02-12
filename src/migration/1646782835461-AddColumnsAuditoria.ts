import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnsAuditoria1646782835461 implements MigrationInterface {
    name = 'AddColumnsAuditoria1646782835461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_deleted\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_deleted\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_updatedDate\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_createdDate\``);
    }

}
