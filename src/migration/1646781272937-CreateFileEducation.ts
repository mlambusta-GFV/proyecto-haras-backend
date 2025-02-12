import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFileEducation1646781272937 implements MigrationInterface {
    name = 'CreateFileEducation1646781272937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`Location_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD \`Responsible_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD CONSTRAINT \`FK_05aca00ec029437cad2afb1f99b\` FOREIGN KEY (\`Location_id\`) REFERENCES \`location\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`file_generic\` ADD CONSTRAINT \`FK_658f4a951e510f5223687ca7041\` FOREIGN KEY (\`Responsible_id\`) REFERENCES \`human\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP FOREIGN KEY \`FK_658f4a951e510f5223687ca7041\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP FOREIGN KEY \`FK_05aca00ec029437cad2afb1f99b\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`Responsible_id\``);
        await queryRunner.query(`ALTER TABLE \`file_generic\` DROP COLUMN \`Location_id\``);
    }

}
