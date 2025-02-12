import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingDeparturDate1660579748900 implements MigrationInterface {
    name = "AddingDeparturDate1660579748900"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `location_horse_history` ADD `_departureDate` date");
        await queryRunner.query(`CREATE TEMPORARY TABLE IF NOT EXISTS aux AS (SELECT _id,
            (SELECT MIN(_date) FROM location_horse_history HD 
            WHERE HD.Horse_id=H.Horse_id AND HD._date >= H._date and HD._id > H._id) AS newDepartur
            FROM location_horse_history H);`);
        await queryRunner.query(`UPDATE location_horse_history H
            INNER JOIN aux ON aux._id= H._id
            SET H._departureDate = aux.newDepartur;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `location_horse_history` DROP COLUMN `_departureDate`");
    }

}
