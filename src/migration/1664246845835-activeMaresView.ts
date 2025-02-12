import {MigrationInterface, QueryRunner} from "typeorm";

export class activeMaresView1664246845835 implements MigrationInterface {
    name = "activeMaresView1664246845835"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE OR REPLACE VIEW \`active_mares_view\` AS 
    SELECT HN._name AS mareName
    ,HCMa.IdHorse_id AS mareId
    ,ifnull( HM._name, HN._name) AS motherName
    ,ifnull( HM._id, HN._id) AS motherId
    ,HF._name AS fatherName
    ,HF._id AS fatherId
    ,L._name As locationName
    ,L._id As locationId
    ,VL._value AS clasificationName
    ,HCFa._date AS inseminationDate
    ,date_add(HCFa._date, INTERVAL 336 DAY) AS estimationBirthDate
    FROM history_classification HCMa
    INNER JOIN value_list VL ON (HCMa.ClasificationName_id = VL._id)
    INNER JOIN horse HN ON (HCMa.IdHorse_id = HN._id AND HN._deleted=0)
    INNER JOIN location L ON (L._id = HN.Location_id)
    LEFT JOIN history_classification HCRe ON (HCRe._cycle = HCMa._cycle AND HCRe.IdHorse_id = HCMa.IdHorse_id AND HCRe.ClasificationName_id = 43)  
    LEFT JOIN horse HM ON (HCRe.IdRelatedHorse_id = HM._id)
    LEFT JOIN history_classification HCFa ON (HCFa._cycle = HCMa._cycle AND HCFa.IdHorse_id = HCMa.IdHorse_id AND HCFa.ClasificationName_id IN (68,69))  
    LEFT JOIN horse HF ON (HCFa.IdRelatedHorse_id = HF._id)
    WHERE HCMa._deleted = 0
    AND HCMa.ClasificationName_id IN (44,45)
    AND HCMa._cycle = (SELECT HCL._cycle from history_classification HCL WHERE HCL.IdHorse_id = HCMa.IdHorse_id order by _cycle desc, _id desc Limit 1)
    AND HCMa.ClasificationName_id = (SELECT HCL.ClasificationName_id from history_classification HCL WHERE HCL.IdHorse_id = HCMa.IdHorse_id order by _cycle desc, _id desc Limit 1)
    `);
        await queryRunner.query("INSERT INTO `typeorm_metadata`(`database`, `schema`, `table`, `type`, `name`, `value`) VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)", ["haras_db","VIEW","active_mares_view","SELECT HN._name AS mareName\n    ,HCMa.IdHorse_id AS mareId\n    ,ifnull( HM._name, HN._name) AS motherName\n    ,ifnull( HM._id, HN._id) AS motherId\n    ,HF._name AS fatherName\n    ,HF._id AS fatherId\n    ,L._name As locationName\n    ,L._id As locationId\n    ,VL._value AS clasificationName\n    ,HCFa._date AS inseminationDate\n    ,date_add(HCFa._date, INTERVAL 336 DAY) AS estaimationBirthDate\n    FROM history_classification HCMa\n    INNER JOIN value_list VL ON (HCMa.ClasificationName_id = VL._id)\n    INNER JOIN horse HN ON (HCMa.IdHorse_id = HN._id AND HN._deleted=0)\n    INNER JOIN location L ON (L._id = HN.Location_id)\n    LEFT JOIN history_classification HCRe ON (HCRe._cycle = HCMa._cycle AND HCRe.IdHorse_id = HCMa.IdHorse_id AND HCRe.ClasificationName_id = 43)  \n    LEFT JOIN horse HM ON (HCRe.IdRelatedHorse_id = HM._id)\n    LEFT JOIN history_classification HCFa ON (HCFa._cycle = HCMa._cycle AND HCFa.IdHorse_id = HCMa.IdHorse_id AND HCFa.ClasificationName_id IN (68,69))  \n    LEFT JOIN horse HF ON (HCFa.IdRelatedHorse_id = HF._id)\n    WHERE HCMa._deleted = 0\n    AND HCMa.ClasificationName_id IN (44,45)\n    AND HCMa._cycle = (SELECT HCL._cycle from history_classification HCL WHERE HCL.IdHorse_id = HCMa.IdHorse_id order by _cycle desc, _id desc Limit 1)\n    AND HCMa.ClasificationName_id = (SELECT HCL.ClasificationName_id from history_classification HCL WHERE HCL.IdHorse_id = HCMa.IdHorse_id order by _cycle desc, _id desc Limit 1)"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `typeorm_metadata` WHERE `type` = ? AND `name` = ? AND `schema` = ?", ["VIEW","active_mares_view","haras_db"]);
        await queryRunner.query("DROP VIEW `active_mares_view`");
    }

}
