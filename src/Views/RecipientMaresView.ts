import { ViewEntity, ViewColumn } from "typeorm"

@ViewEntity({
    expression: `
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
    `,
})
export class RecipientMaresView {
    @ViewColumn()
    cycle: number

    @ViewColumn()
    recipientId: number

    @ViewColumn()
    recipientName: string

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
            "recipientName": this.recipientName,
            "motherName": this.motherName,
            "fatherName": this.fatherName,
            "sonName": this.sonName,
            "pregnant": this.pregnant
        }
    }

}