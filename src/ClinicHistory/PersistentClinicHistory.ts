/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createQueryBuilder, QueryRunner } from "typeorm";
import { Peoples } from "../Peoples/Peoples";
import { Horses } from "../Horse/Horses";
import { FileSystemMediaCenter } from "../MediaCenters/FileSystemMediaCenter";
import { Appointment } from "./Appointment";
import { ClinicHistory } from "./ClinicHistory";
import { Diagnosis } from "./Diagnosis";
import { Treatment } from "./Treatment";
import { InterventionType } from "../ValuesList/ValueList";
import { Interventions } from "./Interventions";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { MediaCenter } from "../MediaCenters/MediaCenter";
import { Veterinarian } from "../Peoples/Veterinarian";
import { Filter } from "../Provider/Filter";

export class PersistentClinicHistory extends ClinicHistory {
    private _queryRunner: QueryRunner;
    private _horses: Horses;
    private _peoples: Peoples;
    private _valuesList: ValuesLists;
    private _mediaCenter: MediaCenter;
    private _filter: Filter

    constructor(queryRunner: QueryRunner, horses: Horses, peoples: Peoples, valuesList: ValuesLists, mediaCenter: MediaCenter) {
        super();
        this._queryRunner = queryRunner;
        this._horses = horses;
        this._peoples = peoples;
        this._valuesList = valuesList
        this._mediaCenter = mediaCenter
        this._filter = Filter.initialize("Appointment", ["id", "name", "date", "description", "veterinarian", "veterinarianAssistant", "horse", "deleted", "classificationType"],
            ["equal", "like", "between"], ["string", "boolean", "object", "date"], ["name"]);
    }

    private async createAppointment(idHorse: number, idVeterinarian: number, idVeterinarianAssistant: number, name: string, information: string, date: Date) {
        const foundHorse = await this._horses.findById(idHorse,
            () => new Error(FileSystemMediaCenter.FILE_NOT_FOUND))
        const foundVeterinarian = <Veterinarian>await this._peoples.findVeterinarianById(idVeterinarian, () => {
            throw new Error(Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        })
        let foundVeterinarianAssistant = null
        if (idVeterinarianAssistant !== null && idVeterinarianAssistant !== undefined) {
            foundVeterinarianAssistant = <Veterinarian>await this._peoples.findVeterinarianById(idVeterinarianAssistant, () => {
                throw new Error(Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
            })
        }

        return Appointment.with(foundHorse, foundVeterinarian, foundVeterinarianAssistant, name,
            information, date);
    }

    async addAppointment(idHorse: number, idVeterinarian: number, idVeterinarianAssistant: number, information: string,
        date: Date, name: string): Promise<Appointment> {
        const newAppointment = await this.createAppointment(idHorse, idVeterinarian, idVeterinarianAssistant, name, information, date);
        await this._queryRunner.manager.save(newAppointment)
        return newAppointment
    }

    public async updateAppointmentById(appointmentId: number, idHorse: number, idVeterinarian: number, idVeterinarianAssistant: number,
        information: string, date: Date, name: string) {
        const actualAppointment = <Appointment>await this.findAppointmentById(appointmentId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT)
            })
        const newAppointment = await this.createAppointment(idHorse, idVeterinarian, idVeterinarianAssistant, name, information, date);
        actualAppointment.sync(newAppointment)
        await this._queryRunner.manager.save(actualAppointment);
        return actualAppointment
    }

    private assertHasValues(filters: [{ name: string, values: [], condition: string, type: string }]): void {
        const isValidCondition = filters.every(filter => {
            if (filter.values !== undefined)
                return filter.values.length > 0
            return true
        })
        if (!isValidCondition) {
            throw new Error(Filter.ERROR_INVALID_FILTER_CONDITION)
        }
    }

    async filterAppointment(search: string, filters: any, page: number, limit: number, order: any): Promise<Appointment[]> {
        const skip = limit * page
        if (order === undefined || order === null) {
            order = {
                field: "id",
                order: "DESC"
            }
        }
        this.assertHasValues(filters)
        const where = this._filter.createWhere(search, filters)
        // @ts-ignore
        const appointmentFound: Appointment[] = await createQueryBuilder("Appointment")
            .leftJoinAndSelect("Appointment._horse", "horse")
            .leftJoinAndSelect("Appointment._diagnosis", "Diagnosis")
            .leftJoinAndSelect("Diagnosis._treatments", "treatments")
            .leftJoinAndSelect("Appointment._veterinarian", "veterinarian")
            .leftJoinAndSelect("Appointment._veterinarianAssistant", "veterinarianAssistant")
            .leftJoinAndSelect("Appointment._interventions", "interventions")
            .where(where)
            .orderBy("Appointment._" + order.field, order.order)
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return appointmentFound
    }

    async amountAppointment(): Promise<number> {
        return await this._queryRunner.manager.count(Appointment);
    }

    async containAppointmentId(id: number): Promise<boolean> {
        const appointment = await this._queryRunner.manager.findOne(Appointment, id)

        return appointment !== undefined;
    }

    async addDiagnosis(appointmentId: number, name: string, description: string, anamnesis: string): Promise<Diagnosis> {
        const appointment = <Appointment>await this.findAppointmentById(appointmentId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT)
            })

        const newDiagnosis = appointment.addDiagnosis(name, description, anamnesis)
        await this._queryRunner.manager.save(newDiagnosis)
        return newDiagnosis
    }

    async updateDiagnosisById(diagnosisId: number, appointmentId: number, name: string, description: string, anamnesis: string): Promise<Diagnosis> {
        const actualDiagnosis = <Diagnosis>await this.findDiagnosisById(diagnosisId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_DIAGNOSIS)
            })
        const appointment = <Appointment>await this.findAppointmentById(appointmentId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT)
            })
        const newDiagnosis = Diagnosis.with(name, description, anamnesis, appointment)
        actualDiagnosis.sync(newDiagnosis)
        await this._queryRunner.manager.save(actualDiagnosis)
        return newDiagnosis
    }

    async findDiagnosisById(diagnosisId: number, failedClosure: () => any) {
        const diagnosisFound = await this._queryRunner
            .manager
            .findOne(Diagnosis, {
                where: { _id: diagnosisId },
                relations: ["_treatments", "_appointment", "_appointment._horse", "_appointment._horse._location",
                    "_appointment._veterinarian"]
            })
        if (diagnosisFound === undefined)
            return failedClosure()
        return diagnosisFound
    }

    async addTreatment(diagnosisId: number, name: string, info: string, startDate: Date, endDate: Date): Promise<Treatment> {
        const diagnosis = await this.findDiagnosisById(diagnosisId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_DIAGNOSIS)
            })
        // @ts-ignore
        const newTreatment = diagnosis.addTreatment(name, info, startDate, endDate)
        await this._queryRunner.manager.save(newTreatment)
        return newTreatment
    }

    async updateTreatmentById(idTreatment: number, diagnosisId: number, name: string, info: string, startDate: Date, endDate: Date): Promise<Treatment> {
        const actualTreatment = <Treatment>await this.findTreatmentById(idTreatment,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_TREATMENT)
            })
        const diagnosis = <Diagnosis>await this.findDiagnosisById(diagnosisId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_DIAGNOSIS)
            })
        const newTreatment = Treatment.with(name, info, startDate, endDate, diagnosis);
        actualTreatment.sync(newTreatment)
        await this._queryRunner.manager.save(actualTreatment)
        return actualTreatment
    }

    async findAppointmentById(appointmentId: number, failedClosure: () => void) {
        const appointmentFound = await this._queryRunner
            .manager
            .findOne(Appointment, {
                where: { _id: appointmentId },
                relations: ["_veterinarian", "_diagnosis", "_horse", "_horse._location", "_interventions"]
            })
        if (appointmentFound === undefined)
            return failedClosure()
        return appointmentFound
    }

    async findAppointmentHorse(idHorse: number, failedClosure: () => any, limit: number, page: number): Promise<any[]> {
        const order: any = {};
        order._date = "DESC";
        const appointmentFound = await this._queryRunner
            .manager
            .findAndCount(Appointment, {
                where: { _horse: idHorse },
                order: order,
                relations: ["_veterinarian", "_veterinarianAssistant", "_diagnosis", "_diagnosis._treatments",
                    "_interventions", "_interventions._type", "_interventions._filesAttachment","_interventions._appointment",]
            })
        if (appointmentFound === undefined)
            return failedClosure()
        return appointmentFound
    }

    async addIntervention(appointmentId: number, descriptions: string, typeId: number): Promise<Interventions> {
        const appointment = await this.findAppointmentById(appointmentId,
            () => { throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT) })
        const type = await this._valuesList.findById("InterventionType", typeId,
            () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })

        // @ts-ignore
        const intervention = appointment.addIntervention(descriptions, type)
        await this._queryRunner.manager.save(intervention)
        return intervention
    }

    async updateIntervention(interventionId: number, appointmentId: number, descriptions: string, typeId: number): Promise<Interventions> {
        const actualIntervention = <Interventions>await this.findInterventionById(interventionId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_INTERVENTION)
            })
        const appointment = <Appointment>await this.findAppointmentById(appointmentId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT)
            })
        const type = await this._valuesList.findById("InterventionType", typeId,
            () => {
                throw new Error(ValuesLists.ERROR_NOT_FOUND)
            })
        const newIntervention = Interventions.with(descriptions, type, appointment)
        actualIntervention.sync(newIntervention)

        await this._queryRunner.manager.save(actualIntervention)
        return actualIntervention
    }

    async addAttachmentToIntervention(interventionId: number, description: string, imageProfileArrayBuffer: []): Promise<void> {
        const intervention = await this.findInterventionById(interventionId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_INTERVENTION)
            })
        if (imageProfileArrayBuffer !== null && imageProfileArrayBuffer !== undefined) {
            imageProfileArrayBuffer.forEach(async (image: any) => {
                const newFileIntervention = await this._mediaCenter.addInterventionFile(image.name, description, image.arrayBuffer, intervention)

                await this._queryRunner.manager.save(newFileIntervention);
            })
        }
    }

    public async findInterventionById(interventionId: number, failedClosure: () => any) {
        const appointmentFound = await this._queryRunner
            .manager
            .findOne(Interventions, {
                where: { _id: interventionId },
                relations: ["_filesAttachment"]
            })
        if (appointmentFound === undefined)
            return failedClosure()

        return appointmentFound
    }

    public async findTreatmentById(treatmentId: number, failedClosure: () => any) {
        const appointmentFound = await this._queryRunner
            .manager
            .findOne(Treatment, {
                where: { _id: treatmentId }
            })
        if (appointmentFound === undefined)
            return failedClosure()

        return appointmentFound
    }

    async deleteAppointment(appointmentId: number) {
        const deletedAppointment = <Appointment>await this.findAppointmentById(appointmentId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_APPOINTMENT)
            })
        deletedAppointment.delete()
        await this._queryRunner.manager.save(deletedAppointment);
    }

    async deleteDiagnosis(diagnosisId: number) {
        const deletedDiagnosis = <Diagnosis>await this.findDiagnosisById(diagnosisId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_DIAGNOSIS)
            })
        deletedDiagnosis.delete()
        await this._queryRunner.manager.save(deletedDiagnosis);
    }

    async deleteTreatment(diagnosisId: number) {
        const actualTreatment = <Treatment>await this.findTreatmentById(diagnosisId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_TREATMENT)
            })
        actualTreatment.delete()
        await this._queryRunner.manager.save(actualTreatment);
    }

    async deleteIntervention(interventionId: number) {
        const deletedIntervention = <Interventions>await this.findInterventionById(interventionId,
            () => {
                throw new Error(ClinicHistory.ERROR_CAN_NOT_FIND_INTERVENTION)
            })
        deletedIntervention.delete()
        await this._queryRunner.manager.save(deletedIntervention);
    }

    async findLastAppointmentByHorse(idHorse: number) {
        const column: any = {};
        column._createdDate = "DESC";
        const lastAppointment = await this._queryRunner.manager.findOne(Appointment, {
            where: { _deleted: false, _horse: idHorse },
            relations: ["_veterinarian", "_veterinarianAssistant", "_diagnosis", "_diagnosis._treatments",
                "_interventions", "_interventions._type", "_interventions._filesAttachment"],
            order: column
        });
        if (lastAppointment === undefined)
            return null

        return lastAppointment
    }

    async cosolidatedHistoryConsolidation(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy
        let defaultOrder = "DESC"
        switch (order.field) {
            case "_Appointment_id":
                orderBy = {
                    "Appointment._id": order.order,
                }
                break;
            case "_Appointment_horse":
                orderBy = {
                    "horse._name": order.order,
                }
                break;
            case "_Appointment_veterinarian":
                orderBy = {
                    "veterinarian._firstName": order.order,
                    "veterinarian._lastName": order.order
                }
                break;
            case "_Appointment_location":
                orderBy = {
                    "location._name": order.order,
                }
                break;
            case "_Interventions_type":
                orderBy = {
                    "classificationType._value": order.order,
                }
                break;
            case "_Appointment_date":
                orderBy = {}
                defaultOrder = order.order
                break;
            default:
                orderBy = { ["Appointment." + order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)

        let where = this._filter.createWhere(search, filters)
        where = where.length > 0 ? where + " AND horse._deleted = false" : "horse._deleted = false";

        const appointmentFound = await createQueryBuilder("Appointment")
            .innerJoinAndSelect("Appointment._horse", "horse")
            .leftJoinAndSelect("Appointment._diagnosis", "diagnosis")
            .leftJoinAndSelect("diagnosis._treatments", "treatments")
            .leftJoinAndSelect("Appointment._veterinarian", "veterinarian")
            .leftJoinAndSelect("Appointment._veterinarianAssistant", "veterinarianAssistant")
            .leftJoinAndSelect("Appointment._interventions", "interventions")
            .leftJoinAndSelect("interventions._type", "classificationType")
            .where(where)
            .orderBy(orderBy)
            // @ts-ignore
            .addOrderBy("Appointment._date", defaultOrder)
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        if (appointmentFound === undefined) {
            return [[], 0]
        }
        const result: any = []
        const data = appointmentFound[0];
        for (let i = 0; i < data.length; i++) {
            const appoiment = data[i];
            // @ts-ignore
            if (appoiment._diagnosis != undefined && appoiment._diagnosis.length > 0) {
                // @ts-ignore
                for (let j = 0; j < appoiment._diagnosis.length; j++) {
                    // @ts-ignore
                    const diagnosis: Diagnosis = appoiment._diagnosis[j]
                    if (diagnosis._treatments != undefined && diagnosis._treatments.length > 0) {
                        for (let k = 0; k < diagnosis._treatments.length; k++) {
                            const treatments: Treatment = diagnosis._treatments[k]
                            // @ts-ignore
                            if (appoiment._interventions != undefined && appoiment._interventions.length > 0) {
                                // @ts-ignore
                                for (let l = 0; l < appoiment._interventions.length; l++) {
                                    // @ts-ignore
                                    const interventions: Interventions = appoiment._interventions[l]
                                    result.push(
                                        {
                                            // @ts-ignore
                                            ...appoiment.toJsonReport(),
                                            // @ts-ignore
                                            ...diagnosis.toJsonReport(),
                                            // @ts-ignore
                                            ...treatments.toJsonReport(),
                                            // @ts-ignore
                                            ...interventions.toJsonReport(),
                                        }
                                    )
                                }
                            }
                            else {
                                result.push(
                                    {
                                        // @ts-ignore
                                        ...appoiment.toJsonReport(),
                                        // @ts-ignore
                                        ...diagnosis.toJsonReport(),
                                        // @ts-ignore
                                        ...treatments.toJsonReport(),
                                    }
                                )
                            }
                        }
                    }
                    else {
                        // @ts-ignore
                        if (appoiment._interventions != undefined && appoiment._interventions.length > 0) {
                            // @ts-ignore
                            for (let l = 0; l < appoiment._interventions.length; l++) {
                                // @ts-ignore
                                const interventions: Interventions = appoiment._interventions[l]
                                result.push(
                                    {
                                        // @ts-ignore
                                        ...appoiment.toJsonReport(),
                                        // @ts-ignore
                                        ...diagnosis.toJsonReport(),
                                        // @ts-ignore
                                        ...interventions.toJsonReport(),
                                    }
                                )
                            }
                        }
                        else {
                            result.push(
                                {
                                    // @ts-ignore
                                    ...appoiment.toJsonReport(),
                                    // @ts-ignore
                                    ...diagnosis.toJsonReport(),
                                }
                            )
                        }
                    }
                }
            }
            else {
                // @ts-ignore
                if (appoiment._interventions != undefined && appoiment._interventions.length > 0) {
                    // @ts-ignore
                    for (let l = 0; l < appoiment._interventions.length; l++) {
                        // @ts-ignore
                        const interventions: Interventions = appoiment._interventions[l]
                        result.push(
                            {
                                // @ts-ignore
                                ...appoiment.toJsonReport(),
                                // @ts-ignore
                                ...interventions.toJsonReport(),
                            }
                        )
                    }
                }
                else {
                    result.push(
                        {
                            // @ts-ignore
                            ...appoiment.toJsonReport(),
                        }
                    )
                }
            }
        }
        appointmentFound[0] = result;
        return appointmentFound
    }
}