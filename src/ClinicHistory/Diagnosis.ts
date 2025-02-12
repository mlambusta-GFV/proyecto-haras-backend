import {Appointment} from "./Appointment";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Treatment} from "./Treatment";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { htmlToText } = require("html-to-text");

@Entity()
export class Diagnosis {
    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _anamnesis: string
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({type: "boolean", default: false})
    private _deleted: boolean
    @Column("text")
    private _name: string
    @Column("text")
    private _description: string

    @ManyToOne(()=> Appointment, appointment => appointment.diagnosis)
    _appointment: Appointment
    @OneToMany(()=> Treatment, treatment => treatment._diagnosis)
    _treatments: Treatment[]

    static readonly ERROR_NAME_CAN_NOT_BE_EMPTY = "Diagnosis name can not be blank";
    static readonly ERROR_APPOINTMENT_CAN_NOT_BE_EMPTY = "Appointment can not be empty";

    get id(): number {
        return this._id;
    }

    get treatments(): Treatment[] {
        return this._treatments
    }

    get appointment() {
        return this._appointment;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get anamnesis(): string {
        return this._anamnesis
    }

    private static assertNameNotEmpty(diagnosisName: string) {
        if(diagnosisName === undefined || diagnosisName === null || diagnosisName.trim().length === 0)
            throw new Error(this.ERROR_NAME_CAN_NOT_BE_EMPTY)
    }

    private static assertAppointmentNotEmpty(appointment: Appointment) {
        if(appointment === null || appointment === undefined)
            throw new Error(this.ERROR_APPOINTMENT_CAN_NOT_BE_EMPTY)
    }

    static with(diagnosisName: string, diagnosisInfo: string, anamnesis: string, appointment: Appointment): Diagnosis {
        this.assertNameNotEmpty(diagnosisName)
        this.assertAppointmentNotEmpty(appointment)

        const newDiagnosis = new this(diagnosisName, diagnosisInfo, anamnesis, appointment)
        newDiagnosis._treatments = []
        return newDiagnosis
    }

    private constructor(diagnosisName: string, diagnosisInfo: string, anamnesis: string, appointment: Appointment) {
        this._name = diagnosisName
        this._description = diagnosisInfo
        this._appointment = appointment
        this._anamnesis = anamnesis
    }

    public addTreatment(name: string, info: string, startDate: Date, endDate: Date): Treatment {
        const treatment = Treatment.with(name, info, startDate, endDate, this);
        this.treatments.push(treatment)

        return treatment
    }

    amountTreatments() {
        return this.treatments.length
    }

    hasTreatment(treatmentToFind: Treatment) {
        return this.treatments.some(treatment => treatment.isEqual(treatmentToFind))
    }

    nameIs(name: string): boolean {
        return this.name === name
    }

    appointmentIs(appointment: Appointment): boolean {
        return this.appointment.isEqual(appointment)
    }

    isEquals(diagnosis: Diagnosis) {
        return this.nameIs(diagnosis.name) && this.appointmentIs(diagnosis.appointment)
    }

    infoIs(info: string) {
        return info === this.description
    }

    toJSON() {
        return{
            "id": this.id,
            "name": this.name,
            "description": this.description,
            "treatments": this.treatments,
            "anamnesis": this.anamnesis
        }
    }

    toJsonReport() {
        return {
            "Diagnosis_id": this.id,
            "Diagnosis_name": this.name,
            "Diagnosis_description": htmlToText(this.description),
            "Diagnosis_anamnesis": this.anamnesis
        }
    }

    hasAnyTreatment() {
        return this.treatments.length > 0
    }

    setEndDate(treatment: Treatment, endDate: Date) {
        if(this.hasTreatment(treatment))
            treatment.setEndDate(endDate)
    }

    delete() {
        this.treatments.forEach( treatment => treatment.delete())
        this._deleted = true
    }

    sync(newDiagnosis: Diagnosis) {
        this._name = newDiagnosis.name
        this._description = newDiagnosis.description
        this._anamnesis = newDiagnosis.anamnesis
    }
}