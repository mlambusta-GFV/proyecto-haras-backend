import { FileHorse } from "./FileHorse";
import { ChildEntity, Column, ManyToOne } from "typeorm";
import { People } from "../Peoples/People";
import { FileType } from "../ValuesList/ValueList";
import { Horse } from "../Horse/Horse";
import { Tag } from "./Tag";
import { getTranslation } from "../Provider/Translator";

@ChildEntity()
export class FileTraining extends FileHorse {
    static readonly ERROR_TRAINING_HORSE_RIDER_NOT_EMPTY = "Horse Rider can not be empty";

    @Column({ type: "text", nullable: true })
    private _jump: string
    @Column({ type: "decimal", nullable: true })
    private _faults: number
    @Column({ type: "decimal", nullable: true })
    private _result: number
    @Column({ type: "text", nullable: true })
    private _club: string
    @ManyToOne(() => People, people => people.riders)
    private _horseRider: People

    static assertNotEmptyResponsible(horseRider: People) {
        if (horseRider === null || horseRider === undefined)
            throw new Error(this.ERROR_TRAINING_HORSE_RIDER_NOT_EMPTY)
    }

    static createFileTraining(directory: string, nameFile: string, description: string, fileType: FileType, horse: Horse, tags: Tag[],
        horseRider: People, jump: string, faults: number, result: number, club: string, showInWeb: boolean, name: string, date: Date) {
        this.assertValidName(nameFile)
        this.assertHorseNotEmpty(horse)
        this.assertNotEmptyResponsible(horseRider)

        nameFile = this.addDateToNameFile(nameFile)
        return new this(directory, nameFile, description, fileType, horse, tags, horseRider, jump, faults, result, club, showInWeb, name, date)
    }

    constructor(directory: string, nameFile: string, description: string, fileType: FileType, horse: Horse, tags: Tag[],
        horseRider: People, jump: string, faults: number, result: number, club: string, showInWeb: boolean, name: string, date: Date) {
        super(directory, nameFile, description, fileType, horse, tags, showInWeb, name, date)

        this._horseRider = horseRider;
        this._jump = jump;
        this._faults = faults;
        this._result = result;
        this._club = club;
    }

    set horseRider(horseRider: People) {
        this._horseRider = horseRider
    }

    get horseRider() {
        return this._horseRider
    }

    set jump(jump: string) {
        this._jump = jump
    }

    get jump() {
        return this._jump
    }

    set faults(faults: number) {
        this._faults = faults
    }

    get faults() {
        return this._faults
    }

    set result(result: number) {
        this._result = result
    }

    get result() {
        return this._result
    }

    set club(club: string) {
        this._club = club
    }

    get club() {
        return this._club
    }

    toJSON() {
        return {
            id: this.id,
            url: `${process.env.SERVER}/mediacenter/${this.id}`,
            nameFile: this.nameFile,
            description: this.description,
            horseRider: this.horseRider,
            horse: this.horse,
            jump: this.jump,
            faults: this.faults,
            result: this.result,
            club: this.club,
            type: this.type.key.toLowerCase(),
            name: this.name,
            date: this.date,
            showInWeb: this.showInWeb
        }
    }

    toJsonReport() {
        return {
            id: this.id,
            url: `${process.env.SERVER}/mediacenter/${this.id}`,
            nameFile: this.nameFile,
            description: this.description,
            horseRider: this.horseRider != undefined ? this.horseRider.firstName +" "+ this.horseRider.lastName : "",
            horse: this.horse.name,
            jump: getTranslation(this.jump?.toString()),
            faults: this.faults,
            result: this.result,
            club: this.club,
            type: this.type.key.toLowerCase(),
            name: this.name,
            date: new Date(this.date),
            showInWeb: this.showInWeb,
            horseURL: `${process.env.FRONT_SERVER}/backoffice/horses/${this.horse.id}`
        }
    }
}