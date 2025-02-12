import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingDosis1660914501025 implements MigrationInterface {
    name = 'AddingDosis1660914501025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`horse\` ADD \`_dosis\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`horse\` DROP COLUMN \`_dosis\``);
    }

}
