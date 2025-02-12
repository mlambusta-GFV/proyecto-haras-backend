import {MigrationInterface, QueryRunner} from "typeorm";

export class AddStatusInHorse1646950832847 implements MigrationInterface {
    name = 'AddStatusInHorse1646950832847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`horse\` ADD \`_status\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD \`_startDressage\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`horse\` ADD \`_endDressage\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`horse\` DROP COLUMN \`_endDressage\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP COLUMN \`_startDressage\``);
        await queryRunner.query(`ALTER TABLE \`horse\` DROP COLUMN \`_status\``);
    }

}
