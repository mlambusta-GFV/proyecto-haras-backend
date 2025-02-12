/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ClasificationName } from "../ValuesList/ValueList";
import { createQueryBuilder, QueryRunner } from "typeorm";
import { HistoryClassification } from "./HistoryClassification";
import { HistoryClassifications } from "./HistoryClassifications";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { Horses } from "../Horse/Horses";
import { Filter } from "../Provider/Filter";
import { defaultImg, templateBase, templateSaltoPagina, templateCita, templateDiagnosticos, templateTratamiento, templateCitaEnd, templateIntervencion, templateEnd, templateSecondHeader } from "../Templates/template";
import { ClinicHistory } from "../ClinicHistory/ClinicHistory";
import path from "path";
import { getTranslation } from "../Provider/Translator";

const fs = require("fs");
const sharp = require("sharp");

export class PersistentHistoryClassification extends HistoryClassifications {

    private queryRunner: QueryRunner;
    private valueList: ValuesLists;
    private horses: Horses;
    private clinicHistory: ClinicHistory;
    private _filter: Filter;
    private _filterView: Filter;
    private _filterMothersView: Filter;
    private _filterActiveMaresView: Filter;

    static ERROR_INVALID_FILTER_TYPE = "This filter is invalid";
    static ERROR_INVALID_FILTER_CONDITION = "This condition is invalid";
    static ERROR_INVALID_FILTER_NAME = "This name is invalid";

    constructor(queryRunner: QueryRunner, valueList: ValuesLists, horses: Horses, clinicHistory: ClinicHistory) {
        super()
        this.queryRunner = queryRunner
        this.valueList = valueList;
        this.clinicHistory = clinicHistory;
        this.horses = horses;
        this._filter = Filter.initialize("HistoryClassification",
            ["id", "ClassificationName", "cycle", "date", "comment", "dosis", "deleted", "RelatedHorse", "horse", "horse._name"],
            ["equal", "like", "between"], ["string", "boolean", "object", "date"], ["horse._name", "comment"]);

        this._filterView = Filter.initialize("RecipientMaresView",
            ["recipientId", "motherId", "fatherId", "effectiveness", "attempts", "sons", "recipientName", "motherName", "fatherName"],
            ["equal", "like", "between"], ["string", "boolean", "number"], ["recipientName", "motherName", "fatherName"]);

        this._filterMothersView = Filter.initialize("MothersMaresView",
            ["motherId", "fatherId", "effectiveness", "attempts", "sons", "motherName", "fatherName"],
            ["equal", "like", "between"], ["string", "boolean", "number"], ["motherName", "fatherName"]);

        this._filterActiveMaresView = Filter.initialize("ActiveMaresView",
            ["mareId", "motherId", "fatherId", "locationId", "inseminationDate", "estaimationBirthDate", "motherName", "fatherName", "mareName", "clasificationName", "locationName"],
            ["equal", "like", "between"], ["string", "boolean", "number", "date"], ["motherName", "fatherName", "clasificationName", "mareName", "locationName"]);

    }

    private assertHasValues(filters: [{ name: string, values: [], condition: string, type: string }]): void {
        const isValidCondition = filters.every(filter => {
            if (filter.values !== undefined)
                return filter.values.length > 0
            return true
        })
        if (!isValidCondition) {
            throw new Error(PersistentHistoryClassification.ERROR_INVALID_FILTER_CONDITION)
        }
    }

    async hasHistoryClassification(historyClassificationToCompare: HistoryClassification) {
        const historyClassificationFound = await this.queryRunner.manager
            .findOne(HistoryClassification,
                {
                    where: {
                        _deleted: false,
                        _clasificationName: historyClassificationToCompare.clasificationName,
                        _cycle: historyClassificationToCompare.cycle,
                        _idHorse: historyClassificationToCompare.idHorse
                    },
                    relations: ["_idHorse"]
                });
        return historyClassificationFound != null
    }

    async add(clasificationNameId: number, date: Date, horseId: number, relatedHorseId: number = null, cycle: number, comment: string, stock: number = null, dosis: number = null): Promise<HistoryClassification> {

        const clasificationName = await this.valueList.findByClasificationNameId(clasificationNameId, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        const horse = await this.horses.findById(horseId, () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        let relatedHorse = null

        // @ts-ignore
        if (HistoryClassifications.RELATED_HORSE_REQUIRED[clasificationName.key]) {
            relatedHorse = await this.horses.findById(relatedHorseId, () => { throw new Error(HistoryClassifications.ERROR_RELATED_HORSE_REQUIRED) })
        }

        // @ts-ignore
        const newHistoryClassification = HistoryClassification.initialize(clasificationName, date, horse, relatedHorse, cycle, comment, dosis, stock)
        //await this.assertDuplicatedHistoryClassification(newHistoryClassification)

        await this.queryRunner.manager.save(newHistoryClassification);
        return newHistoryClassification;
    }

    async getHistoryClassificationbyId(ClassificationId: number, failedClosure: () => void): Promise<HistoryClassification> {

        const hClassification: HistoryClassification = await this.queryRunner.manager.findOne(HistoryClassification, {
            where: { _id: ClassificationId },
            relations: ["_idHorse", "_idRelatedHorse", "_clasificationName"]
        });
        return hClassification;
    }

    async update(ClassificationId: number, date: Date, relatedHorseId: number, comment: string): Promise<HistoryClassification> {
        const actualHC = await this.getHistoryClassificationbyId(ClassificationId, () => { throw new Error(HistoryClassifications.ERROR_CLASSIFICATION_NOT_FOUND) });
        actualHC.setComment(comment);
        actualHC.setDate(new Date(date));
        // @ts-ignore
        if (relatedHorseId != "undefined" && relatedHorseId != null && relatedHorseId > 0) {
            const relatedHorse = await this.horses.findById(relatedHorseId, () => { throw new Error(HistoryClassifications.ERROR_RELATED_HORSE_REQUIRED) });
            actualHC.setRelatedHorse(relatedHorse);
        }
        await this.queryRunner.manager.save(actualHC);
        return actualHC;
    }

    async deleteHistoryClassificationbyId(ClassificationId: number): Promise<void> {
        const actualHC = await this.getHistoryClassificationbyId(ClassificationId, () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        // @ts-ignore
        actualHC.delete()
        await this.queryRunner.manager.save(actualHC);
    }

    async amounts() {
        return await this.queryRunner.manager.count(HistoryClassification);
    }

    async hasHistoryClassificationlName(historyClassificationName: ClasificationName,): Promise<boolean> {
        const historyClassificationFound = await this.queryRunner.manager.findOne(HistoryClassification, { where: { _deleted: false, _clasificationName: historyClassificationName }, relations: ["_idHorse"] });

        return historyClassificationFound != null;
    }

    async getAll() {
        return await this.queryRunner.manager.find(HistoryClassification, {
            where: { _deleted: false },
            relations: ["_idHorse", "_idRelatedHorse", "_clasificationName"]
        });
    }

    async possibleNextStatus(horseId: number, actualStatus: number): Promise<any> {
        const horse = await this.horses.findById(horseId, () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) });
        const nextStatus = [...HistoryClassifications.STATUS_RELATIOSN[actualStatus]];

        // @ts-ignore
        if (horse.sex.key === "M") {
            let myIndex = nextStatus.indexOf(8)
            if (myIndex !== -1) {
                nextStatus.splice(myIndex, 1);
            }
            myIndex = nextStatus.indexOf(9)
            if (myIndex !== -1) {
                nextStatus.splice(myIndex, 1);
            }
        } else {
            // @ts-ignore
            if (horse.sex.key === "S") {
                let myIndex = nextStatus.indexOf(1)
                if (myIndex !== -1) {
                    nextStatus.splice(myIndex, 1);
                }
                myIndex = nextStatus.indexOf(2)
                if (myIndex !== -1) {
                    nextStatus.splice(myIndex, 1);
                }
                myIndex = nextStatus.indexOf(3)
                if (myIndex !== -1) {
                    nextStatus.splice(myIndex, 1);
                }
                myIndex = nextStatus.indexOf(4)
                if (myIndex !== -1) {
                    nextStatus.splice(myIndex, 1);
                }
                myIndex = nextStatus.indexOf(16)
                if (myIndex !== -1) {
                    nextStatus.splice(myIndex, 1);
                }
            }
        }

        return Promise.all(nextStatus.map(async element => {
            const classification = <ClasificationName>await this.valueList.findByClasificationNamekey(element.toString(), () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })

            return {
                id: classification.id,
                key: classification.key,
                value: classification.value,
                order: classification.order,
                filter: classification.filter,
                description: classification.description,
                horseRequired: HistoryClassifications.RELATED_HORSE_REQUIRED[element],
                stockRequired: HistoryClassifications.STOCK_REQUIRED[element]
            }
        }))
    }

    async findLastClasificationByHorseId(horseId: number): Promise<HistoryClassification> {
        const column: any = {};
        column._cycle = "DESC";
        column._id = "DESC";
        return await this.queryRunner.manager.findOne(HistoryClassification, {
            where: {
                _deleted: false,
                _idHorse: horseId
            },
            order: column,
            relations: ["_idHorse", "_idRelatedHorse", "_clasificationName"]
        });
    }

    async getLastCycleAndStatusByHorseId(horseId: number): Promise<number> {
        const column: any = {};
        column._cycle = "DESC";
        column._id = "DESC";

        // @ts-ignore
        const historyClassification: HistoryClassification = await createQueryBuilder("HistoryClassification")
            .leftJoinAndSelect("HistoryClassification._idHorse", "Horse")
            .leftJoinAndSelect("HistoryClassification._clasificationName", "ClassificationName")
            .where("Horse._id = :horseId AND HistoryClassification._deleted = false ",
                { horseId: horseId })
            .orderBy("HistoryClassification._id", "DESC")
            .getOne()

        if (historyClassification == undefined || !historyClassification.isGestantes())
            return null
        return historyClassification.cycle
    }

    async findLastCycleAndStatusByHorseId(horseId: number): Promise<HistoryClassification[]> {
        const column: any = {};
        column._cycle = "DESC";
        column._id = "DESC";
        const lastCycle = await this.getLastCycleAndStatusByHorseId(horseId)
        if (lastCycle !== null) {
            return await this.queryRunner.manager.find(HistoryClassification, {
                where: {
                    _deleted: false,
                    _idHorse: horseId,
                    _cycle: lastCycle
                },
                order: column,
                relations: ["_idHorse", "_idRelatedHorse", "_clasificationName"]
            });
        }
        return []
    }

    async findByHorseId(horseId: number): Promise<unknown> {
        const column: any = {};
        column._cycle = "DESC";
        column._id = "DESC";
        return await this.queryRunner.manager.find(HistoryClassification, { where: { _deleted: false, _idHorse: horseId }, order: column, relations: ["_idHorse", "_idRelatedHorse", "_clasificationName"] });
    }

    async changeStatus(actualStatusId: number, nextStatusId: number, horseId: number, relatedHorsId: number, comment: string, date: Date, stock: number, dosis: number, failedClosure: () => void): Promise<any | void> {
        let newStatus;
        const lastCycle = await this.findLastClasificationByHorseId(horseId)
        const actualStatusValueList = await this.valueList.findByClasificationNameId(actualStatusId, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        const nextStatusValueList = await this.valueList.findByClasificationNameId(nextStatusId, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })

        // @ts-ignore 
        if (HistoryClassifications.STATUS_RELATIOSN[actualStatusValueList.key].includes(parseInt(nextStatusValueList.key))) {
            // @ts-ignore 
            const newCycle: number = nextStatusValueList.key == 0 ? parseInt(lastCycle.cycle) + 1 : lastCycle.cycle
            newStatus = await this.add(nextStatusId, date, horseId, relatedHorsId, newCycle, comment, stock, dosis)

            // @ts-ignore 
            if (nextStatusValueList.key == 2 || nextStatusValueList.key == 8) {
                if (stock >= 0) {
                    this.horses.changeStock(horseId, stock, dosis)
                }
                else {
                    throw new Error(HistoryClassifications.INCORRECT_STOCK)
                }
            }
        }
        else {
            throw new Error(HistoryClassifications.INCOMPATIBLE_STATUS)
        }
        return newStatus;
    }

    async getAllStock(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy
        const clasificationName = await this.valueList.findByClasificationNamekey(HistoryClassifications.PAJUELA, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        // @ts-ignore 
        filters.push({ "name": "ClassificationName", "values": [clasificationName.id], "condition": "equal", "type": "object" })

        switch (order.field) {
            case "_horse":
                orderBy = {
                    "horse._name": order.order,
                }
                break;
            case "_horseRider":
                orderBy = {
                    "horseRider._firstName": order.order,
                    "horseRider._lastName": order.order
                }
                break;
            default:
                orderBy = { ["HistoryClassification." + order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)

        let where = this._filter.createWhere(search, filters)
        where = where?.length > 0 ? where + " AND horse._deleted = false" : "horse._deleted = false"

        // @ts-ignore
        const fileFound = await createQueryBuilder("HistoryClassification")
            .innerJoinAndSelect("HistoryClassification._idHorse", "horse")
            .innerJoinAndSelect("HistoryClassification._clasificationName", "ClassificationName")
            .where(where)
            .skip(skip)
            .take(limit)
            .orderBy("_date" !== order.field ? { ...orderBy, "HistoryClassification._date": "DESC" } : orderBy)
            .getManyAndCount()

        if (fileFound === undefined)
            return [[], 0]

        const list = await Promise.all(fileFound[0].map(async element => {
            return {
                // @ts-ignore
                ...element.toJsonReport()
            }
        }))
        fileFound[0] = list;
        return fileFound
    }

    toJsonReport(element: any) {
        return {
            "recipientName": element.recipientName,
            "motherName": element.motherName,
            "fatherName": element.fatherName,
            "sons": parseInt(element.sons),
            "pregnancies": parseInt(element.pregnancies),
            "attempts": parseInt(element.attempts),
            "effectiveness": parseInt(element.effectiveness),
            "recipientURL":`${process.env.FRONT_SERVER}/backoffice/horses/${element.recipientId}`,
            "motherURL":`${process.env.FRONT_SERVER}/backoffice/horses/${element.motherId}`,
            "fatherURL":`${process.env.FRONT_SERVER}/backoffice/horses/${element.fatherId}`
        }
    }

    async performanceRecipientMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy

        switch (order.field) {
            default:
                orderBy = { [order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)
        // @ts-ignore
        const where = this._filterView.createWhere(search, filters).replaceAll("_", "")


        // @ts-ignore
        const fileFound = await createQueryBuilder("RecipientMaresView")
            .select("recipientId, recipientName, motherId, motherName, fatherId, fatherName")
            .addSelect("COUNT(*)", "attempts")
            .addSelect("SUM(pregnant)", "pregnancies")
            .addSelect("count(sonName)", "sons")
            .addSelect("ROUND(count(sonName)/count(*)*100)", "effectiveness")
            .where(where)
            .skip(skip)
            .take(limit)
            .groupBy("RecipientMaresView.recipientName")
            .addGroupBy("RecipientMaresView.motherName")
            .addGroupBy("RecipientMaresView.fatherName")
            .addGroupBy("RecipientMaresView.recipientId")
            .addGroupBy("RecipientMaresView.motherId")
            .addGroupBy("RecipientMaresView.fatherId")
            .orderBy(orderBy)
            .getRawMany()

        // @ts-ignore
        const count = await createQueryBuilder("RecipientMaresView")
            .select("recipientId, recipientName, motherId, motherName, fatherId, fatherName")
            .where(where)
            .groupBy("RecipientMaresView.recipientName")
            .addGroupBy("RecipientMaresView.motherName")
            .addGroupBy("RecipientMaresView.fatherName")
            .addGroupBy("RecipientMaresView.recipientId")
            .addGroupBy("RecipientMaresView.motherId")
            .addGroupBy("RecipientMaresView.fatherId")
            .getRawMany()

        if (fileFound === undefined)
            return [[], 0]

        const list = await Promise.all(fileFound.map(async element => {
            return {
                // @ts-ignore 
                ...this.toJsonReport(element)
            }
        }))

        return [list, count.length]
    }

    async performanceMothersMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy

        switch (order.field) {
            default:
                orderBy = { [order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)
        // @ts-ignore
        const where = this._filterMothersView.createWhere(search, filters).replaceAll("_", "")


        // @ts-ignore
        const fileFound = await createQueryBuilder("MothersMaresView")
            .select("motherId, motherName, fatherId, fatherName")
            .addSelect("COUNT(*)", "attempts")
            .addSelect("SUM(pregnant)", "pregnancies")
            .addSelect("count(sonName)", "sons")
            .addSelect("ROUND(count(sonName)/count(*)*100)", "effectiveness")
            .where(where)
            .skip(skip)
            .take(limit)
            .groupBy("MothersMaresView.motherName")
            .addGroupBy("MothersMaresView.fatherName")
            .addGroupBy("MothersMaresView.motherId")
            .addGroupBy("MothersMaresView.fatherId")
            .orderBy(orderBy)
            .getRawMany()

        // @ts-ignore
        const count = await createQueryBuilder("MothersMaresView")
            .select("motherName, fatherName")
            .where(where)
            .groupBy("MothersMaresView.motherName")
            .addGroupBy("MothersMaresView.fatherName")
            .getRawMany()

        if (fileFound === undefined)
            return [[], 0]

        const list = await Promise.all(fileFound.map(async element => {
            return {
                // @ts-ignore 
                ...this.toJsonReport(element)
            }
        }))
        return [list, count.length]
    }

    async inActivityMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy

        switch (order.field) {
            default:
                orderBy = { [order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)
        // @ts-ignore
        const where = this._filterActiveMaresView.createWhere(search, filters).replaceAll("_", "")


        // @ts-ignore
        const fileFound = await createQueryBuilder("ActiveMaresView")
            .where(where)
            .skip(skip)
            .take(limit)
            .orderBy(orderBy)
            .getManyAndCount()

        if (fileFound === undefined)
            return [[], 0]

        const list = await Promise.all(fileFound[0].map(async element => {
            return {
                // @ts-ignore 
                ...element,
                // @ts-ignore 
                "mareURL":`${process.env.FRONT_SERVER}/backoffice/horses/${element.mareId}`,
                // @ts-ignore 
                "motherURL":`${process.env.FRONT_SERVER}/backoffice/horses/${element.motherId}`,
                // @ts-ignore 
                "fatherURL":`${process.env.FRONT_SERVER}/backoffice/horses/${element.fatherId}`
            }
        }))
        fileFound[0]=list
        return fileFound
    }

    async clinicHistoryPDF(horseId: number) {

        const horse = await this.horses.findById(horseId, () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        const appointments = await this. clinicHistory.findAppointmentHorse(horseId, () => {
            throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT)
        }, 0, 0)
        const imagePath = path.join(__dirname, `../../${process.env.DIRECTORY_HORSE}`, horse.imageProfile.nameFile).toString()
        let bitmap = null
        try {
            await sharp(imagePath)
                .resize({
                    width: 150,
                    height: 150
                })
                .toFile(imagePath + "resized.png");
            bitmap = fs.readFileSync(imagePath + "resized.png", "base64").toString();
        }
        catch {
            bitmap = defaultImg
        }
        const head = templateBase.replace("{0}", bitmap)
            .replace("{1}", horse.name)
            .replace("{2}", horse.dateOfBirth.toLocaleDateString("es-AR"))
            .replace("{3}", calcularEdad(horse.dateOfBirth))
            .replace("{4}", getTranslation(horse.sex.value))
            .replace("{5}", getTranslation(horse.fur.value))
            .replace("{6}", horse?.father?.name??"x")
            .replace("{7}", horse?.mother?.name??"x")
            .replace("{8}", horse.location.name)
            .replace("{9}", new Date().toLocaleDateString("es-AR"))

        let caracteres = 0
        let cantCitas = 1
        let pagina = 1
        //@ts-ignore
        const body = appointments[0].map((ap, index) => {
            let cita = templateCita
            cita = cita.replace("{0}", ap._name)
                .replace("{1}", ap.veterinarian?.firstName + " " + ap.veterinarian?.lastName)
                .replace("{2}", ap.veterinarianAssistant == null ? "" : ap.veterinarianAssistant?.firstName + " " + ap.veterinarianAssistant?.lastName)
                .replace("{3}", ap.description)
                .replace("{4}", ap.date.toLocaleDateString("es-AR"))
            //@ts-ignore
            const diagnosis = ap.diagnosis.map(di => {
                let diacnosticos = templateDiagnosticos
                diacnosticos = diacnosticos.replace("{0}", di.anamnesis)
                    .replace("{1}", di.description);
                //@ts-ignore
                const filas = di.treatments.map(tr => {
                    return `<tr>
                                <td>${tr.name}</td>
                                <td>${tr.info}</td>
                                <td>${tr.startDate.toLocaleDateString("es-AR")}</td>
                                <td>${tr.endDate.toLocaleDateString("es-AR")}</td>
                            </tr>
                            `
                }).join("");
                let tablaTratamiento = templateTratamiento
                tablaTratamiento = filas == "" ? "" : tablaTratamiento.replace("{0}", filas);

                return diacnosticos + tablaTratamiento;
            }).join("");
            //@ts-ignore
            const tablaInterventions = ap.interventions.map(int => {
                return `<tr>
                            <td>${getTranslation(int.type.value)}</td>
                            <td>${int.description}</td>
                        </tr>
                        `
            }).join("");
            let interventions = templateIntervencion
            interventions = tablaInterventions == "" ? "" : interventions.replace("{0}", tablaInterventions)
            let completeCita = cita + diagnosis + interventions + templateCitaEnd;
            if ((((caracteres + completeCita.length > 1850) && (cantCitas !== 1)) || ( (cantCitas === 4) && (pagina === 1))) 
                || ((((caracteres + completeCita.length > 2150) && (cantCitas !== 1)) || ((cantCitas > 4) && (pagina > 1))))){
                pagina++;
                const secondHeader = templateSecondHeader.replace("{0}", horse.name)
                    .replace("{1}", horse?.mother?.name??"x")
                    .replace("{2}", horse?.father?.name??"x")
                    .replace("{3}", horse.dateOfBirth.toLocaleDateString("es-AR"))
                    .replace("{4}", new Date().toLocaleDateString("es-AR"))
                    .replace("{5}", pagina.toFixed())
                caracteres = 0;
                cantCitas = 1;
                const aux = templateSaltoPagina + secondHeader + completeCita;
                completeCita = aux
            }
            else{
                caracteres += completeCita.length;
                cantCitas++;
            }
            return completeCita
        }).join("");
        let pdf = head + body + templateEnd;
        // @ts-ignore
        pdf = pdf.replaceAll("{99}", pagina.toFixed())
        return pdf;
    }
}

function calcularEdad(fecha: Date) {
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }

    if (edad > 0) {
        return edad == 1 ? edad + " año" : edad + " años"
    }
    else {
        return m + " meses"
    }
}