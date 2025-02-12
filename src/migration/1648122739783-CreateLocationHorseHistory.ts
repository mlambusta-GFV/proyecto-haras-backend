import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateLocationHorseHistory1648122739783 implements MigrationInterface {
    name = 'CreateLocationHorseHistory1648122739783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`location_horse_history\` (\`_id\` int NOT NULL AUTO_INCREMENT, \`_date\` date NOT NULL, \`Horse_id\` int NULL, \`Location_id\` int NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`location_horse_history\` ADD CONSTRAINT \`FK_2b81769d85e06fdfa5bc1d264cb\` FOREIGN KEY (\`Horse_id\`) REFERENCES \`horse\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`location_horse_history\` ADD CONSTRAINT \`FK_ae480c7ec480611db8daa0e8971\` FOREIGN KEY (\`Location_id\`) REFERENCES \`location\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location_horse_history\` DROP FOREIGN KEY \`FK_ae480c7ec480611db8daa0e8971\``);
        await queryRunner.query(`ALTER TABLE \`location_horse_history\` DROP FOREIGN KEY \`FK_2b81769d85e06fdfa5bc1d264cb\``);
        await queryRunner.query(`DROP TABLE \`location_horse_history\``);
    }

}
