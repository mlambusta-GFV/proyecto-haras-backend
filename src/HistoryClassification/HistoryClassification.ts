import { ClasificationName } from "../ValuesList/ValueList";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Horse } from "../Horse/Horse";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { htmlToText } = require("html-to-text");

@Entity()
export class HistoryClassification {
    @PrimaryGeneratedColumn()
    private _id: number
    @ManyToOne(() => ClasificationName)
    private _clasificationName: ClasificationName
    @Column({ type: "datetime", nullable: true })
    private _date: Date
    @Column("bigint")
    private _cycle: number
    @Column("text")
    private _comment: string
    @ManyToOne(() => Horse, horse => horse.historyClassificationHorse)
    private _idHorse: Horse
    @ManyToOne(() => Horse, horse => horse.historyClassificationRelatedHorse, { nullable: true })
    private _idRelatedHorse: Horse
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({ type: "boolean", default: false })
    private _deleted: boolean;
    @Column({ type: "bigint", default: null })
    private _stock: number;
    @Column({ type: "bigint", default: null })
    private _dosis: number;

    static readonly ERROR_NAME_BLANK = "Name can not be blank"
    static readonly ERROR_DATE_BLANK = "Date can not be blank"
    static readonly ERROR_INVALID_DOSIS = "Dosis must be >= 0"
    static readonly KEY_PRENIADA = "5"
    static readonly KEY_TRANSFERIDA = "11"
    static readonly KEY_POTRILLO_AL_PIE = "6"
    static readonly KEY_INSIMINADA = "10"

    get id(): number {
        return this._id
    }

    get clasificationName(): ClasificationName {
        return this._clasificationName
    }

    get date(): Date {
        return this._date
    }

    get cycle(): number {
        return this._cycle
    }

    get comment(): string {
        return this._comment
    }

    get idHorse(): Horse {
        return this._idHorse
    }

    get idRelatedHorse(): Horse {
        return this._idRelatedHorse
    }

    get createdDate(): Date {
        return this._createdDate
    }

    get updatedDate(): Date {
        return this._updatedDate
    }

    get deleted(): boolean {
        return this._deleted
    }

    get dosis(): number {
        return this._dosis
    }

    get stock(): number {
        return this._stock
    }

    static assertNotEmptyClasificationName(clasificationName: ClasificationName) {
        if (clasificationName === null || clasificationName === undefined)
            throw new Error(this.ERROR_NAME_BLANK)
    }

    static assertNotEmptyDate(date: Date) {
        if (date === null || date === undefined)
            throw new Error(this.ERROR_DATE_BLANK)
    }

    static assertValidDosis(dosis: number) {
        if (dosis !== null && dosis !== undefined && dosis < 0)
            throw new Error(this.ERROR_INVALID_DOSIS)
    }

    static initialize(clasificationName: ClasificationName, date: Date, idHorse: Horse, idRelatedHorse: Horse, cycle: number, comment: string, dosis: number = null, stock: number = null) {
        this.assertNotEmptyClasificationName(clasificationName)
        this.assertNotEmptyDate(date)

        return new this(clasificationName, date, idHorse, idRelatedHorse, cycle, comment, dosis, stock)
    }

    private constructor(clasificationName: ClasificationName, date: Date, idHorse: Horse, idRelatedHorse: Horse, cycle: number, comment: string, dosis: number = null, stock: number = null) {
        this._clasificationName = clasificationName;
        this._date = date;
        this._cycle = cycle;
        this._comment = comment
        this._idHorse = idHorse;
        this._idRelatedHorse = idRelatedHorse;
        this._dosis = dosis;
        this._stock = stock;
    }

    setDate(date: Date) {
        this._date = date;
    }

    setComment(comment: string) {
        this._comment = comment;
    }

    setRelatedHorse(RelatedHorse: Horse) {
        this._idRelatedHorse = RelatedHorse;
    }

    setDosis(dosis: number) {
        this._dosis = dosis;
    }

    setStock(stock: number) {
        this._stock = stock;
    }

    isEquals(ToCompare: HistoryClassification) {
        return this.clasificationName === ToCompare.clasificationName && this.date === ToCompare.date
    }

    nameIs(clasificationName: ClasificationName) {
        return this.clasificationName === clasificationName
    }

    dateIs(date: Date) {
        return this.date.getTime() === date.getTime()
    }

    delete() {
        this._deleted = true;
    }

    toJSON() {
        return {
            "id": this.id,
            "date": this.date,
            "cycle": this.cycle,
            "comment": this.comment,
            "idHorse": this.idHorse,
            "dosis": this.dosis != null ? this.dosis : "",
            "stock": this.stock != null ? this.stock : "",
            "idRelatedHorse": this.idRelatedHorse,
            "clasificationName": this.clasificationName
        }
    }

    toJsonReport() {
        return {
            "id": this.id,
            "cycle": this.cycle,
            "comment": htmlToText(this.comment),
            "horse": this.idHorse.name,
            "relatedHorse": this.idRelatedHorse?.name,
            "dosis": this.dosis != null ? this.dosis : "",
            "stock": this.stock != null ? this.stock : "",
            "clasificationName": this.clasificationName.value,
            "date": this.date
        }
    }

    isPreniada(): boolean {
        return this.clasificationName.key === HistoryClassification.KEY_PRENIADA;
    }

    isTranferiada() {
        return this.clasificationName.key === HistoryClassification.KEY_TRANSFERIDA
    }

    isPotrilloAlPie() {
        return this.clasificationName.key === HistoryClassification.KEY_POTRILLO_AL_PIE
    }

    isInseminada() {
        return this.clasificationName.key === HistoryClassification.KEY_INSIMINADA
    }

    isGestantes() {
        return this.isInseminada() || this.isPreniada() || this.isPotrilloAlPie() || this.isTranferiada()
    }
}