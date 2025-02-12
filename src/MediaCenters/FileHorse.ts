import {
    ChildEntity, Column,
    JoinTable,
    ManyToMany,
    ManyToOne,
} from "typeorm";
import {Horse} from "../Horse/Horse";
import {Tag} from "./Tag";
import {FileType} from "../ValuesList/ValueList";
import {FileGeneric} from "./FileGeneric";

@ChildEntity()
export class FileHorse extends FileGeneric{
    static readonly ERROR_FILE_HORSE_EMPTY = 'Horse can not be empty';
    static readonly ERROR_FILE_DATE_EMPTY = 'Horse file date can not be empty'

    @ManyToOne(() => Horse,horse => horse.filesData)
    _horse: Horse
    @ManyToMany(() => Tag)
    @JoinTable()
    private _tags: Tag[]
    @Column({type: "boolean", default: false})
    private _showInWeb: boolean
    @Column({type: 'text', nullable: true})
    private _name: string
    @Column({ type: 'date', nullable: true})
    private _date: Date

    get tag(){
        return this._tags
    }

    get horse(): Horse {
        return this._horse
    }

    get tags() {
        return this._tags
    }

    get showInWeb() {
        return this._showInWeb
    }

    get name() {
        return this._name
    }

    get date() {
        return this._date
    }

    set showInWeb(showInWeb: boolean) {
        this._showInWeb = showInWeb
    }

    set name(name: string) {
        this._name = name
    }

    set date(date: Date) {
        this._date = date
    }

    protected static assertHorseNotEmpty(horse: Horse){
        if(horse === null || horse === undefined) throw new Error( FileHorse.ERROR_FILE_HORSE_EMPTY)
    }

    protected static assertNameNotEmpty(name: string){
        if(name === null || name === undefined) throw new Error( FileHorse.ERROR_FILE_NAME_EMPTY)
    }

    protected static assertDateNotEmpty(date: Date){
        if(date === null || date === undefined) throw new Error( FileHorse.ERROR_FILE_DATE_EMPTY)
    }

    static createHorse(directory: string, nameFile: string, description: string, fileType: FileType, horse: Horse,
                       tags: Array<Tag>, showInWeb: boolean, name: string, date: Date){
        this.assertValidName(nameFile)
        this.assertHorseNotEmpty(horse)
        this.assertNameNotEmpty(name)
        this.assertDateNotEmpty(date)

        nameFile = this.addDateToNameFile(nameFile)

        return new this(directory, nameFile, description, fileType, horse, tags, showInWeb, name, date)
    }

    constructor(directory: string, nameFile: string, description: string, fileType: FileType, horse: Horse,
                tags: Array<Tag>, showInWeb: boolean, name: string, date: Date) {
        super(directory, nameFile, description, fileType)

        this._horse = horse;
        this._tags = tags
        this._showInWeb = showInWeb;
        this._name = name;
        this._date = date;
    }

    hasHorse(horse: Horse): boolean
    {
        return this.horse.isEqual(horse)
    }

    fullPath(): string
    {
        return this.directory +  this.nameFile
    }

    isEqual(fileDataCompare: FileHorse): boolean {
        return this.nameIs(fileDataCompare.nameFile)
    }

    hasThisTag(tagFind: Tag): boolean
    {
        return this._tags.some(tag => tag.isEqual(tagFind))
    }

    hasTag(): boolean
    {
        return this._tags.length > 0
    }

    toJSON() {
        {
            return {
                id: this.id,
                url: `${process.env.SERVER}/mediacenter/${this.id}`,
                description: this.description,
                nameFile: this.nameFile,
                type: this.type.key.toLowerCase(),
                name: this.name,
                date: this.date,
                showInWeb: this.showInWeb
            }
        }
    }
}