import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Appointment} from "./Appointment";
import {InterventionType} from "../ValuesList/ValueList";
import {FileAttachment} from "../MediaCenters/FileAttachment";
import { getTranslation } from "../Provider/Translator";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { htmlToText } = require("html-to-text");

@Entity()
export class Interventions {
    @PrimaryGeneratedColumn()
    private _id: number
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({type: "boolean", default: false})
    private _deleted: boolean
    @Column("text")
    private _description: string
    @ManyToOne(()=>Appointment, appointment => appointment._interventions)
    _appointment: Appointment
    @ManyToOne(()=>InterventionType)
    private _type: InterventionType
    @OneToMany(()=>FileAttachment, fileAttachment => fileAttachment._intervention)
    _filesAttachment: FileAttachment[]

    static readonly ERROR_DESCRIPTION_CAN_NOT_BE_EMPTY = "Description can not be empty";
    static readonly ERROR_INTERVENTION_TYPE_CAN_NOT_BE_EMPTY = "Intervention type can not ve empty ";
    static readonly ERROR_APPOINTMENT_CAN_NOT_BE_EMPTY = "Appointment can not be empty in intervention";

    get id(): number {
        return this._id;
    }

    get filesAttachment() : FileAttachment[] {
        return this._filesAttachment
    }

    get description(): string {
        return this._description;
    }

    get type(): InterventionType {
        return this._type;
    }

    get appointment(): Appointment {
        return this._appointment
    }

    private static assertDescriptionNotEmpty(diagnosisName: string) {
        if(diagnosisName === undefined || diagnosisName === null || diagnosisName.trim().length === 0)
            throw new Error(this.ERROR_DESCRIPTION_CAN_NOT_BE_EMPTY)
    }

    private static assertInterventionTypeNotEmpty(interventionType: InterventionType) {
        if(interventionType === undefined || interventionType === null )
            throw new Error(this.ERROR_INTERVENTION_TYPE_CAN_NOT_BE_EMPTY)
    }

    private static assertAppointmentNotEmpty(appointment: Appointment) {
        if(appointment === undefined || appointment === null)
            throw new Error(this.ERROR_APPOINTMENT_CAN_NOT_BE_EMPTY)
    }

    static with(descriptions: string, type: InterventionType, appointment: Appointment) {
        this.assertInterventionTypeNotEmpty(type)
        this.assertAppointmentNotEmpty(appointment)

        const newInterventions  = new this(descriptions, type, appointment)
        newInterventions._filesAttachment = []

        return newInterventions
    }

    private constructor(descriptions: string, type: InterventionType, appointment: Appointment) {
        this._description = descriptions;
        this._type = type;
        this._appointment = appointment;
    }

    descriptionIs(descriptions: string) {
        return this.description === descriptions
    }

    hasAppointment(appointment: Appointment) {
        return this.appointment.isEqual(appointment)
    }

    toJSON(){
        return {
            "id": this.id,
            "description": this.description,
            "type": this.type,
            "attachment": this.filesAttachment,
            "date": this.appointment?.date
        }
    }

    toJsonReport() {
        return {
            "Interventions_id": this.id,
            "Interventions_description": htmlToText(this.description),
            "Interventions_type": getTranslation(this.type.value)
        }
    }

    addAttachment(newFile: FileAttachment) {
        this._filesAttachment.push(newFile)
    }

    delete() {
        this._deleted = true
    }

    sync(newIntervention: Interventions) {
        this._description = newIntervention.description
        this._type = newIntervention.type
    }
}