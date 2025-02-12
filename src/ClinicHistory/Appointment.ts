import { Veterinarian } from "../Peoples/Veterinarian";
import { Horse } from "../Horse/Horse";
import { Diagnosis } from "./Diagnosis";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Interventions } from "./Interventions";
import { InterventionType } from "../ValuesList/ValueList";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { htmlToText } = require("html-to-text");

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    private _id: number
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({ type: "boolean", default: false })
    private _deleted: boolean
    @Column({ type: "datetime" })
    private _date: Date
    @Column("text")
    private _name: string
    @Column("text")
    private _description: string
    @ManyToOne(() => Veterinarian)
    @JoinColumn()
    private _veterinarian: Veterinarian
    @ManyToOne(() => Veterinarian)
    @JoinColumn()
    private _veterinarianAssistant: Veterinarian
    @ManyToOne(() => Horse)
    @JoinColumn()
    private _horse: Horse
    @OneToMany(() => Diagnosis, diagnosis => diagnosis._appointment)
    private _diagnosis: Diagnosis[]
    @OneToMany(() => Interventions, intervention => intervention._appointment)
    _interventions: Interventions[]

    static readonly ERROR_HORSE_EMPTY = "Horse can not be empty";
    static readonly ERROR_VETERINARIAN_EMPTY = "Veterinarian can not be empty";
    static readonly ERROR_DATE_EMPTY = "Date can not be empty";

    get id(): number {
        return this._id;
    }

    get date(): Date {
        return this._date;
    }

    get description(): string {
        return this._description;
    }

    get veterinarian(): Veterinarian {
        return this._veterinarian;
    }

    get veterinarianAssistant(): Veterinarian {
        return this._veterinarianAssistant;
    }

    get horse(): Horse {
        return this._horse;
    }

    get diagnosis(): Diagnosis[] {
        return this._diagnosis;
    }

    get name(): string {
        return this._name
    }

    get interventions(): Interventions[] {
        return this._interventions
    }

    private static assertNotEmptyHorse(horse: Horse) {
        if (horse === null || horse === undefined)
            throw new Error(Appointment.ERROR_HORSE_EMPTY)
    }

    private static assertNotEmptyVeterinarian(veterinarian: Veterinarian) {
        if (veterinarian === null || veterinarian === undefined)
            throw new Error(Appointment.ERROR_VETERINARIAN_EMPTY)
    }

    private static assertNotEmptyDate(date: Date) {
        if (date === null || date === undefined)
            throw new Error(Appointment.ERROR_DATE_EMPTY)
    }

    static with(horse: Horse, veterinarian: Veterinarian, veterinarianAssistant: Veterinarian, name: string,
        info: string, date: Date): Appointment {
        this.assertNotEmptyHorse(horse)
        this.assertNotEmptyVeterinarian(veterinarian)
        this.assertNotEmptyDate(date)

        const newAppointment = new this(horse, veterinarian, veterinarianAssistant, name, info, date)
        newAppointment._diagnosis = []
        return newAppointment
    }

    private constructor(horse: Horse, veterinarian: Veterinarian, veterinarianAssistant: Veterinarian, name: string, info: string, date: Date) {
        this._horse = horse
        this._veterinarian = veterinarian
        this._veterinarianAssistant = veterinarianAssistant
        this._description = info
        this._date = date
        this._name = name
    }

    horseIs(horse: Horse): boolean {
        if (horse !== null && horse !== undefined)
            return this.horse.isEqual(horse)
        return false
    }

    veterinarianIs(veterinarian: Veterinarian): boolean {
        if (veterinarian !== null && veterinarian !== undefined)
            return this.veterinarian.isEqual(veterinarian)
        return false
    }

    veterinarianAssistantIs(veterinarianAssistant: Veterinarian): boolean {
        if (this.hasVeterinarianAssistant() && veterinarianAssistant !== null && veterinarianAssistant !== undefined)
            return this.veterinarianAssistant.isEqual(veterinarianAssistant)
        return false
    }

    hasVeterinarianAssistant(): boolean {
        return this.veterinarianAssistant !== null
    }

    informationIs(info: string): boolean {
        return this.description === info
    }

    dateIs(date: Date): boolean {
        if (date !== null && date !== undefined)
            return date.getTime() === date.getTime()
        return false
    }

    addDiagnosis(diagnosisName: string, diagnosisInfo: string, anamnesis: string) {
        const newDiagnosis = Diagnosis.with(diagnosisName, diagnosisInfo, anamnesis, this)
        this.diagnosis.push(newDiagnosis)

        return newDiagnosis;
    }

    hasDiagnosis() {
        if (this.diagnosis !== null && this.diagnosis.length > 0)
            return true
        return false
    }

    amountDiagnosis() {
        if (this.hasDiagnosis())
            return this.diagnosis.length
        return 0
    }

    isEqual(appointment: Appointment): boolean {
        return this.horseIs(appointment.horse) &&
            this.veterinarianIs(appointment.veterinarian) &&
            this.dateIs(appointment.date)
    }

    addIntervention(descriptions: string, type: InterventionType) {
        const newIntervention = Interventions.with(descriptions, type, this)
        this.interventions.push(newIntervention)

        return newIntervention;
    }

    sync(newAppointment: Appointment) {
        this._name = newAppointment.name
        this._date = newAppointment.date
        this._description = newAppointment.description
        this._veterinarian = newAppointment.veterinarian
        this._veterinarianAssistant = newAppointment.veterinarianAssistant
        this._horse = newAppointment.horse
    }

    delete() {
        this.diagnosis.forEach(diag => diag.delete())
        this._deleted = true
    }

    toJSON() {
        return {
            "id": this.id,
            "name": this.name,
            "description": this.description,
            "date": this.date,
            "veterinarian": this.veterinarian,
            "veterinarianAssistant": this.veterinarianAssistant,
            "horse": this.horse,
            "diagnosis": this.diagnosis,
            "interventions": this.interventions
        }
    }

    toJsonReport() {
        return {
            "Appointment_id": this.id,
            "Appointment_name": this.name,
            "Appointment_description": htmlToText(this.description),
            "Appointment_date": this.date,
            "Appointment_horse": this.horse.name,
            "Appointment_veterinarian": this.veterinarian != null ? this.veterinarian.firstName + " " + this.veterinarian.lastName : "",
            "Appointment_veterinarianAssistant": this.veterinarianAssistant != null ? this.veterinarianAssistant.firstName + " " + this.veterinarianAssistant   .lastName : "",
            horseURL: `${process.env.FRONT_SERVER}/backoffice/horses/${this.horse.id}`
        }
    }
}