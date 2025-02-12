import {MigrationInterface, QueryRunner} from "typeorm";

export class prueba1649538288154 implements MigrationInterface {
    name = 'prueba1649538288154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_faults\` decimal NULL`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_result\` decimal NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_result\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_faults\``);
    }

}
