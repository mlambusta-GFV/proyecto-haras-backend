import { ViewEntity, ViewColumn } from "typeorm"

@ViewEntity({
    expression: `
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
    `,
})

export class MothersMaresView {
    @ViewColumn()
    cycle: number

    @ViewColumn()
    motherId: number

    @ViewColumn()
    motherName: string

    @ViewColumn()
    fatherId: number

    @ViewColumn()
    fatherName: string

    @ViewColumn()
    sonId: number

    @ViewColumn()
    sonName: string

    @ViewColumn()
    pregnant: number

    toJsonReport() {
        return {
            "motherName": this.motherName,
            "fatherName": this.fatherName,
            "sonName": this.sonName,
            "pregnant": this.pregnant
        }
    }

}