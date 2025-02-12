import {MigrationInterface, QueryRunner} from "typeorm";

export class MediacenterShowInWeb1647635874467 implements MigrationInterface {
    name = 'MediacenterShowInWeb1647635874467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_showInWeb\` tinyint NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`horse\` CHANGE \`_endDressage\` \`_endDressage\` timestamp(6) NULL`);
    }

}
