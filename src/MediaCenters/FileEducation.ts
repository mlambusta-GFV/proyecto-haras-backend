import { FileHorse } from "./FileHorse";
import { FileType } from "../ValuesList/ValueList";
import { Horse } from "../Horse/Horse";
import { Tag } from "./Tag";
import { Location } from "../Locations/Location";
import { ChildEntity, ManyToOne } from "typeorm";
import { Human } from "../Peoples/Human";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { htmlToText } = require("html-to-text");

@ChildEntity()
export class FileEducation extends FileHorse {
    static readonly ERROR_EDUCATION_LOCATION_NOT_EMPTY = "Education location can not be empty";
    static readonly ERROR_EDUCATION_RESPONSIBLE_NOT_EMPTY = "Education responsible can not be empty";

    @ManyToOne(() => Location, location => location.horses)
    private _location: Location
    @ManyToOne(() => Human)
    private _responsible: Human

    static assertNotEmptyLocation(location: Location) {
        if (location === null || location === undefined)
            throw new Error(this.ERROR_EDUCATION_LOCATION_NOT_EMPTY)
    }

    static assertNotEmptyResponsible(responsible: Human) {
        if (responsible === null || responsible === undefined)
            throw new Error(this.ERROR_EDUCATION_RESPONSIBLE_NOT_EMPTY)
    }

    static changeImageExtensionToWebp(nameFile: string): string {
        const extension = nameFile.split(".").pop();
        return nameFile.replace(extension, "webp")
    }

    static createEducation(directory: string, nameFile: string, description: string, fileType: FileType, horse: Horse, tags: Tag[],
        location: Location, responsible: Human, showInWeb: boolean, name: string, date: Date) {
        this.assertValidName(nameFile)
        this.assertHorseNotEmpty(horse)
        this.assertNotEmptyLocation(location)
        //this.assertNotEmptyResponsible(responsible)

        nameFile = this.addDateToNameFile(nameFile)
        return new this(directory, nameFile, description, fileType, horse, tags, location, responsible, showInWeb, name, date)
    }

    constructor(directory: string, nameFile: string, description: string, fileType: FileType, horse: Horse, tags: Tag[],
        location: Location, responsible: Human, showInWeb: boolean, name: string, date: Date) {
        super(directory, nameFile, description, fileType, horse, tags, showInWeb, name, date)

        this._location = location
        this._responsible = responsible
    }

    get location(): Location {
        return this._location;
    }

    get responsible(): Human {
        return this._responsible;
    }

    set location(location: Location) {
        this._location = location
    }

    set responsible(responsible: Human) {
        this._responsible = responsible
    }

    toJSON() {
        return {
            id: this.id,
            url: `${process.env.SERVER}/mediacenter/${this.id}`,
            description: this.description,
            nameFile: this.nameFile,
            location: this.location,
            responsible: this.responsible,
            type: this.type.key.toLowerCase(),
            name: this.name,
            date: this.date,
            showInWeb: this.showInWeb,
            horseURL: `${process.env.FRONT_SERVER}/backoffice/horses/${this.horse.id}`
        }
    }

    toJsonReport() {
        return {
            id: this.id,
            url: `${process.env.SERVER}/mediacenter/${this.id}`,
            nameFile: this.nameFile,
            description: htmlToText(this.description),
            location: this.location.name,
            responsible: this.responsible != undefined ? this.responsible.firstName + " " + this.responsible.lastName : "",
            horse: this.horse.name,
            type: this.type.key.toLowerCase(),
            name: this.name,
            date: new Date(this.date),
            showInWeb: this.showInWeb,
            horseURL: `${process.env.FRONT_SERVER}/backoffice/horses/${this.horse.id}`
        }
    }
}