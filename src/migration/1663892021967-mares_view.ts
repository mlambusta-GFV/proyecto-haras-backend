import {MigrationInterface, QueryRunner} from "typeorm";

export class maresView1663892021967 implements MigrationInterface {
    name = "maresView1663892021967"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP VIEW `recipient_mares_view`");

        await queryRunner.query("DROP VIEW `mothers_mares_view`");

        await queryRunner.query(`CREATE VIEW \`mothers_mares_view\` AS 
    SELECT 	HCMa._cycle as cycle
            ,M._id as motherId
            ,M._name as motherName
            ,P._id as fatherId
            ,P._name as fatherName
            ,if(HCYp._id > 0,1,0) AS pregnant
            ,H._id AS sonId
            ,H._name AS sonName
    FROM horse M
    INNER JOIN history_classification HCMa ON (HCMa.IdHorse_id = M._id AND HCMa.ClasificationName_id=42) 
    LEFT JOIN history_classification HCIn ON (HCIn._cycle = HCMa._cycle AND HCIn.IdHorse_id = HCMa.IdHorse_id AND HCIn.ClasificationName_id=68)  
    LEFT JOIN horse P ON HCIn.IdRelatedHorse_id = P._id
    LEFT JOIN history_classification HCYp ON (HCYp._cycle = HCMa._cycle AND HCYp.IdHorse_id = HCMa.IdHorse_id AND HCYp.ClasificationName_id=44) 
    LEFT JOIN history_classification HCPa ON (HCPa._cycle = HCMa._cycle AND HCPa.IdHorse_id = HCMa.IdHorse_id AND HCPa.ClasificationName_id=45)  
    LEFT JOIN horse H ON HCPa.IdRelatedHorse_id = H._id
    WHERE HCMa._deleted = 0 AND M._deleted = 0

    UNION ALL

    SELECT 	HCMa._cycle as cycle
		,M._id as motherId
        ,M._name as motherName
        ,P._id as fatherId
        ,P._name as fatherName
         ,if(HCYp._id > 0,1,0) AS pregnant
        ,H._id AS sonId
        ,H._name AS sonName
    FROM horse M
    INNER JOIN history_classification HCMa ON (HCMa.IdRelatedHorse_id = M._id AND HCMa.ClasificationName_id=43) 
    LEFT JOIN history_classification HCTr ON (HCTr._cycle = HCMa._cycle AND HCTr.IdHorse_id = HCMa.IdHorse_id AND HCTr.ClasificationName_id=69)  
    LEFT JOIN horse P ON HCTr.IdRelatedHorse_id = P._id
    LEFT JOIN history_classification HCYp ON (HCYp._cycle = HCMa._cycle AND HCYp.IdHorse_id = HCMa.IdHorse_id AND HCYp.ClasificationName_id=44) 
    LEFT JOIN history_classification HCPa ON (HCPa._cycle = HCMa._cycle AND HCPa.IdHorse_id = HCMa.IdHorse_id AND HCPa.ClasificationName_id=45)  
    LEFT JOIN horse H ON HCPa.IdRelatedHorse_id = H._id
    WHERE HCMa._deleted = 0 AND M._deleted = 0;
    `);
        await queryRunner.query("INSERT INTO `haras_db`.`typeorm_metadata`(`database`, `schema`, `table`, `type`, `name`, `value`) VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)", ["haras_db","VIEW","mothers_mares_view","SELECT \tHCMa._cycle as cycle\n            ,M._id as motherId\n            ,M._name as motherName\n            ,P._id as fatherId\n            ,P._name as fatherName\n            ,if(HCYp._id > 0,1,0) AS pregnant\n            ,H._id AS sonId\n            ,H._name AS sonName\n    FROM horse M\n    INNER JOIN history_classification HCMa ON (HCMa.IdHorse_id = M._id AND HCMa.ClasificationName_id=42) \n    LEFT JOIN history_classification HCIn ON (HCIn._cycle = HCMa._cycle AND HCIn.IdHorse_id = HCMa.IdHorse_id AND HCIn.ClasificationName_id=68)  \n    LEFT JOIN horse P ON HCIn.IdRelatedHorse_id = P._id\n    LEFT JOIN history_classification HCYp ON (HCYp._cycle = HCMa._cycle AND HCYp.IdHorse_id = HCMa.IdHorse_id AND HCYp.ClasificationName_id=44) \n    LEFT JOIN history_classification HCPa ON (HCPa._cycle = HCMa._cycle AND HCPa.IdHorse_id = HCMa.IdHorse_id AND HCPa.ClasificationName_id=45)  \n    LEFT JOIN horse H ON HCPa.IdRelatedHorse_id = H._id\n    WHERE HCMa._deleted = 0 AND M._deleted = 0\n\n    UNION ALL\n\n    SELECT \tHCMa._cycle as cycle\n\t\t,M._id as motherId\n        ,M._name as motherName\n        ,P._id as fatherId\n        ,P._name as fatherName\n         ,if(HCYp._id > 0,1,0) AS pregnant\n        ,H._id AS sonId\n        ,H._name AS sonName\n    FROM horse M\n    INNER JOIN history_classification HCMa ON (HCMa.IdRelatedHorse_id = M._id AND HCMa.ClasificationName_id=43) \n    LEFT JOIN history_classification HCTr ON (HCTr._cycle = HCMa._cycle AND HCTr.IdHorse_id = HCMa.IdHorse_id AND HCTr.ClasificationName_id=69)  \n    LEFT JOIN horse P ON HCTr.IdRelatedHorse_id = P._id\n    LEFT JOIN history_classification HCYp ON (HCYp._cycle = HCMa._cycle AND HCYp.IdHorse_id = HCMa.IdHorse_id AND HCYp.ClasificationName_id=44) \n    LEFT JOIN history_classification HCPa ON (HCPa._cycle = HCMa._cycle AND HCPa.IdHorse_id = HCMa.IdHorse_id AND HCPa.ClasificationName_id=45)  \n    LEFT JOIN horse H ON HCPa.IdRelatedHorse_id = H._id\n    WHERE HCMa._deleted = 0 AND M._deleted = 0;"]);
        await queryRunner.query(`CREATE VIEW \`recipient_mares_view\` AS 
    SELECT HCR._cycle cycle, 
    R._id recipientId, 
    R._name recipientName, 
    M._id motherId, 
    M._name motherName, 
    P._id fatherId, 
    P._name fatherName , 
	if(HCYp._id > 0,1,0) AS pregnant,
    H._id sonId, 
    H._name  sonName
    FROM history_classification HCR
    INNER JOIN horse R ON HCR.IdHorse_id = R._id
    INNER JOIN horse M ON HCR.IdRelatedHorse_id = M._id
    LEFT JOIN history_classification HCP ON (HCP._cycle = HCR._cycle AND HCP.IdHorse_id = HCR.IdHorse_id AND HCP.ClasificationName_id=69)
    LEFT JOIN horse P ON HCP.IdRelatedHorse_id = P._id
    LEFT JOIN history_classification HCYp ON (HCYp._cycle = HCR._cycle AND HCYp.IdHorse_id = HCR.IdHorse_id AND HCYp.ClasificationName_id=44) 
    LEFT JOIN history_classification HCH ON (HCH._cycle = HCR._cycle AND HCH.IdHorse_id = HCR.IdHorse_id AND HCH.ClasificationName_id=45)
    LEFT JOIN horse H ON HCH.IdRelatedHorse_id = H._id
    WHERE HCR.ClasificationName_id=43
    and HCR._deleted = 0;
    `);
        await queryRunner.query("INSERT INTO `typeorm_metadata`(`database`, `schema`, `table`, `type`, `name`, `value`) VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)", ["haras_db","VIEW","recipient_mares_view","SELECT HCR._cycle cycle, \n    R._id recipientId, \n    R._name recipientName, \n    M._id motherId, \n    M._name motherName, \n    P._id fatherId, \n    P._name fatherName , \n\tif(HCYp._id > 0,1,0) AS pregnant,\n    H._id sonId, \n    H._name  sonName\n    FROM history_classification HCR\n    INNER JOIN horse R ON HCR.IdHorse_id = R._id\n    INNER JOIN horse M ON HCR.IdRelatedHorse_id = M._id\n    LEFT JOIN history_classification HCP ON (HCP._cycle = HCR._cycle AND HCP.IdHorse_id = HCR.IdHorse_id AND HCP.ClasificationName_id=69)\n    LEFT JOIN horse P ON HCP.IdRelatedHorse_id = P._id\n    LEFT JOIN history_classification HCYp ON (HCYp._cycle = HCR._cycle AND HCYp.IdHorse_id = HCR.IdHorse_id AND HCYp.ClasificationName_id=44) \n    LEFT JOIN history_classification HCH ON (HCH._cycle = HCR._cycle AND HCH.IdHorse_id = HCR.IdHorse_id AND HCH.ClasificationName_id=45)\n    LEFT JOIN horse H ON HCH.IdRelatedHorse_id = H._id\n    WHERE HCR.ClasificationName_id=43\n    and HCR._deleted = 0;"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DELETE FROM `typeorm_metadata` WHERE `type` = ? AND `name` = ? AND `schema` = ?", ["VIEW","recipient_mares_view","haras_db"]);
        await queryRunner.query("DROP VIEW `recipient_mares_view`");
        await queryRunner.query("DELETE FROM `typeorm_metadata` WHERE `type` = ? AND `name` = ? AND `schema` = ?", ["VIEW","mothers_mares_view","haras_db"]);
        await queryRunner.query("DROP VIEW `mothers_mares_view`");
    }

}
