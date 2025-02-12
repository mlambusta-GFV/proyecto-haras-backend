import { ViewEntity, ViewColumn } from "typeorm"

@ViewEntity({
    expression: `
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
    LEFT JOIN history_classification HCRe ON (HCRe._cycle = HCMa._cycle AND HCRe.IdHorse_id = HCMa.IdHorse_id AND HCRe.ClasificationName_id = 43 AND HCRe._deleted = 0)  
    LEFT JOIN horse HM ON (HCRe.IdRelatedHorse_id = HM._id)
    LEFT JOIN history_classification HCFa ON (HCFa._cycle = HCMa._cycle AND HCFa.IdHorse_id = HCMa.IdHorse_id AND HCFa.ClasificationName_id IN (68,69) AND HCFa._deleted = 0)  
    LEFT JOIN horse HF ON (HCFa.IdRelatedHorse_id = HF._id)
    WHERE HCMa._deleted = 0 
    AND HCMa.ClasificationName_id IN (44,45)
    AND HCMa._cycle = (SELECT HCL._cycle from history_classification HCL WHERE HCL.IdHorse_id = HCMa.IdHorse_id order by _cycle desc, _id desc Limit 1)
    AND HCMa.ClasificationName_id = (SELECT HCL.ClasificationName_id from history_classification HCL WHERE HCL.IdHorse_id = HCMa.IdHorse_id order by _cycle desc, _id desc Limit 1)
    `,
})

export class ActiveMaresView {
    @ViewColumn()
    mareId: number

    @ViewColumn()
    mareName: string

    @ViewColumn()
    motherId: number

    @ViewColumn()
    motherName: string

    @ViewColumn()
    fatherId: number

    @ViewColumn()
    fatherName: string

    @ViewColumn()
    locationId: number

    @ViewColumn()
    locationName: string

    @ViewColumn()
    clasificationName: string

    @ViewColumn()
    inseminationDate: Date

    @ViewColumn()
    estimationBirthDate: Date

    toJsonReport() {
        return {
            "mareName": this.mareName,
            "motherName": this.motherName,
            "fatherName": this.fatherName,
            "locationName": this.locationName,
            "clasificationName": this.clasificationName,
            "inseminationDate": this.inseminationDate,
            "estaimationBirthDate": this.estimationBirthDate
        }
    }

}