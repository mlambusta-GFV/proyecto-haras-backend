import {MigrationInterface, QueryRunner} from "typeorm";

export class DeleteDefaultTimestamp1647024284779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE horse ALTER COLUMN \`_startDressage\` DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE horse ALTER COLUMN \`_startDressage\` SET DEFAULT null;`);
        await queryRunner.query(`ALTER TABLE horse ALTER COLUMN \`_endDressage\` DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE horse ALTER COLUMN \`_endDressage\` SET DEFAULT null;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE horse ALTER COLUMN \`_startDressage\` DROP CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE horse ALTER COLUMN \`_endDressage\` DROP CURRENT_TIMESTAMP(6)`);
    }

}
