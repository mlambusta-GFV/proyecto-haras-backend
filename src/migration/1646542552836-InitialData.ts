import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialData1646542552836 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`TRUNCATE TABLE human`)
        await queryRunner.query(`TRUNCATE TABLE location`)
        await queryRunner.query(`TRUNCATE TABLE value_list`)
    }

}
