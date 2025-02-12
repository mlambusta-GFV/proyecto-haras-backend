import {Diagnosis} from "./Diagnosis";
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Treatment {
    @PrimaryGeneratedColumn()
    private _id: number
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({type: "boolean", default: false})
    private _deleted: boolean
    @Column("text")
    private _name: string
    @Column("text")
    private _info: string
    @Column({type:"datetime"})
    private _startDate: Date
    @Column({type:"datetime", nullable: true})
    private _endDate: Date
    @ManyToOne(()=> Diagnosis, diagnosis => diagnosis._appointment)
    _diagnosis: Diagnosis

    static readonly ERROR_NAME_EMPTY = "Name can not be empty";
    static readonly ERROR_DIAGNOSIS_EMPTY = "Diagnosis can not be empty";
    static readonly ERROR_START_DATE_EMPTY = "Start date ca not be empty"

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get info(): string {
        return this._info;
    }

    get startDate(): Date {
        return this._startDate;
    }

    get endDate(): Date {
        return this._endDate;
    }

    get diagnosis(): Diagnosis {
        return this._diagnosis
    }

    private static assertNameNotEmpty(name: string) {
        if(name === undefined || name === null || name.trim().length === 0)
            throw new Error(Treatment.ERROR_NAME_EMPTY)
    }

    private static assertDiagnosisNotEmpty(diagnosis: Diagnosis) {
        if(diagnosis === null || diagnosis === undefined)
            throw new Error(Treatment.ERROR_DIAGNOSIS_EMPTY)
    }

    private static assertStartDateNotEmpty(startDate: Date) {
        if(startDate === null || startDate === undefined)
            throw new Error(Treatment.ERROR_START_DATE_EMPTY)
    }

    static with(name: string, info: string, startDate: Date, endDate: Date, diagnosis: Diagnosis) {
        this.assertNameNotEmpty(name)
        this.assertStartDateNotEmpty(startDate)
        this.assertDiagnosisNotEmpty(diagnosis)

        return new this(name, info, startDate, endDate, diagnosis)
    }

    private constructor(name: string, info: string, startDate: Date, endDate: Date, diagnosis: Diagnosis) {
        this._name = name;
        this._info = info;
        this._startDate = startDate;
        this._endDate = endDate;
        this._diagnosis = diagnosis;
    }

    public nameIs(name: string): boolean {
        return this.name === name
    }

    public infoIs(info: string): boolean {
        return this.info === info
    }

    public diagnosisIs(diagnosis: Diagnosis): boolean {
        return this.diagnosis.isEquals(diagnosis)
    }

    public startDateIs(startDate: Date): boolean {
        return this.startDate.getTime() === startDate.getTime()
    }

    public endDateIs(endDate: Date): boolean {
        return endDate.getTime() === endDate.getTime()
    }

    isEqual(treatmentToCompare: Treatment) {
        return this.nameIs(treatmentToCompare.name) && this.diagnosisIs(treatmentToCompare.diagnosis) &&
            this.startDateIs(treatmentToCompare.startDate)
    }

    toJSON() {
        return{
            "id": this.id,
            "name": this.name,
            "info": this.info,
            "startDate": this.startDate,
            "endDate": this.endDate,
        }
    }

    toJsonReport() {
        return {
            "Treatment_id": this.id,
            "Treatment_name": this.name,
            "Treatment_info": this.info,
            "Treatment_startDate": this.startDate,
            "Treatment_endDate": this.endDate,
        }
    }

    setEndDate(endDate: Date) {
        this._endDate = endDate
    }

    delete() {
        this._deleted = true
    }

    sync(newTreatment: Treatment) {
        this._name = newTreatment.name
        this._info = newTreatment.info
        this._startDate = newTreatment.startDate
        this._endDate = newTreatment.endDate
    }
}