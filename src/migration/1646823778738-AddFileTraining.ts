import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFileTraining1646823778738 implements MigrationInterface {
    name = 'AddFileTraining1646823778738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_jump\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`_club\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`HorseRider_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD CONSTRAINT \`FK_1d3107282d773c662926de397eb\` FOREIGN KEY (\`HorseRider_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP FOREIGN KEY \`FK_1d3107282d773c662926de397eb\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`HorseRider_id\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_club\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`_jump\``);
    }

}
