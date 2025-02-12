import {MigrationInterface, QueryRunner} from "typeorm";

export class HumanDelete1647468001721 implements MigrationInterface {
    name = 'HumanDelete1647468001721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`human\` ADD \`_createdDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`human\` ADD \`_updatedDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`human\` ADD \`_deleted\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`human\` DROP COLUMN \`_deleted\``);
        await queryRunner.query(`ALTER TABLE \`human\` DROP COLUMN \`_updatedDate\``);
        await queryRunner.query(`ALTER TABLE \`human\` DROP COLUMN \`_createdDate\``);
    }

}
