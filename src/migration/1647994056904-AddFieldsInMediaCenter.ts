import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFieldsInMediaCenter1647994056904 implements MigrationInterface {
    name = 'AddFieldsInMediaCenter1647994056904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_name\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_date\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_date\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_name\``);
    }

}
