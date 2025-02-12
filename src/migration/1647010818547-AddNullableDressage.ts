import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNullableDressage1647010818547 implements MigrationInterface {
    name = 'AddNullableDressage1647010818547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`horse\` CHANGE \`_startDressage\` \`_startDressage\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`horse\` CHANGE \`_endDressage\` \`_endDressage\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`horse\` CHANGE \`_endDressage\` \`_endDressage\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`horse\` CHANGE \`_startDressage\` \`_startDressage\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
