import {Location} from "../Locations/Location";
import {Fur, Sex} from "../ValuesList/ValueList";
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Veterinarian} from "../Peoples/Veterinarian";
import {FileHorse} from "../MediaCenters/FileHorse";
import {MediaCenter} from "../MediaCenters/MediaCenter";
import {Tag} from "../MediaCenters/Tag";
import {Document} from "../Documents/Document";
import {People} from "../Peoples/People";
import { HistoryClassification } from "../HistoryClassification/HistoryClassification";
import { Post } from "../Posts/Post";
import { Task } from "../Tasks/Task";
import {LocationHorseHistory} from "./LocationHorseHistory";
import { getTranslation } from "../Provider/Translator";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { htmlToText } = require("html-to-text");

@Entity()
export class Horse {
    static readonly ERROR_NAME_BLANK = "Name can not be blank"
    static readonly ERROR_INVALID_SEX = "Sex can not be blank";
    static readonly ERROR_EMPTY_LOCATION = "Location con not be empty";
    static readonly ERROR_EMPTY_SHOW_IN_WEB = "Show in web can not be empty";
    static readonly ERROR_EMPTY_STATUS = "Status can not be empty";

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({ type: "boolean", default: false })
    private _deleted: boolean;

    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _name: string
    @Column({type:"datetime", nullable: true})
    private _dateOfBirth: Date
    @ManyToOne(()=> Location, location => location.horses)
    private _location: Location
    @ManyToOne(()=> Sex)
    private _sex: Sex
    @ManyToOne(()=> Fur)
    private _fur: Fur
    @Column({type: "text", nullable: true})
    private _AAFEFataSheet: string
    @Column({type: "text", nullable: true})
    private _observation: string
    @Column({type: "text", nullable: true})
    private _pedigree: string
    @Column({type: "text", nullable: true})
    private _passport: string
    @Column("integer")
    private _stock: number
    @Column("integer")
    private _dosis: number
    @Column({type: "boolean", default: false})
    private _showInWeb: boolean
    @Column({type: "boolean", default: true})
    private _status: boolean
    @ManyToOne(()=> Veterinarian, veterinarian => veterinarian.horses)
    private _veterinarian: Veterinarian;
    @ManyToOne(() => Horse)
    @JoinColumn()
    private _father: Horse
    @ManyToOne(() => Horse)
    @JoinColumn()
    private _mother: Horse
    @ManyToOne(()=> People, people => people.riders)
    private _rider: People
    @OneToMany(()=> FileHorse, fileData => fileData._horse)
    private _filesData: FileHorse[]
    @OneToMany(()=> Document,document => document.horse)
    private _documents: Document[]
    @OneToMany(()=> Post,post => post.horse)
    private _post: Post[]
    @OneToMany(()=> Task, task => task.horse)
    private _tasks: Task[]
    @OneToOne(() => FileHorse)
    @JoinColumn()
    private _imageProfile: FileHorse
    @OneToMany(()=> HistoryClassification, historyClassification => historyClassification.idHorse)
    _historyClassificationHorse: HistoryClassification[]
    @OneToMany(()=> HistoryClassification, historyClassification => historyClassification.idRelatedHorse)
    private _historyClassificationRelatedHorse: HistoryClassification[]
    @CreateDateColumn({ type: "timestamp", nullable: true, default: null })
    private _startDressage: Date;
    @CreateDateColumn({ type: "timestamp", nullable: true, default: null })
    private _endDressage: Date;
    @OneToMany(()=> LocationHorseHistory, locationHistory => locationHistory._horse, {cascade: true})
    _locationsHistory: LocationHorseHistory[];
    @ManyToOne(()=> People, people => people.owner)
    private _owner: People

    set startDressage(startDressage: Date) {
        this._startDressage = startDressage
    }

    set endDressage(endDressage: Date) {
        this._endDressage = endDressage
    }

    get observation():string {
        return this._observation
    }

    get father(): Horse {
        return this._father;
    }

    get mother(): Horse {
        return this._mother;
    }

    get rider(): People {
        return this._rider;
    }

    get owner(): People {
        return this._owner;
    }

    get fur(): Fur {
        return this._fur;
    }

    get AAFEFataSheet(): string {
        return this._AAFEFataSheet;
    }

    get pedigree(): string {
        return this._pedigree;
    }

    get passport(): string {
        return this._passport;
    }

    get createdAt(): Date {
        return this._createdDate;
    }

    get updatedAt(): Date {
        return this._updatedDate;
    }

    get showInWeb(): boolean {
        return this._showInWeb;
    }

    get imageProfile(): FileHorse {
        return this._imageProfile;
    }

    get posts(): Post[]
    {
        return this._post;
    }

    get tasks(): Task[]
    {
        return this._tasks;
    }

    get deleted(): boolean
    {
        return this._deleted;
    }
    get filesData(): FileHorse[]
    {
        return this._filesData
    }

    get documents(): Document[]
    {
        return this._documents
    }

    get id(): number {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get veterinarian(): Veterinarian {
        return this._veterinarian
    }

    get dateOfBirth(): Date {
        return this._dateOfBirth
    }

    get location(): Location {
        return this._location
    }

    get sex(): Sex
    {
        return this._sex
    }

    get historyClassificationHorse(): HistoryClassification[] {
        return this._historyClassificationHorse
    }

    get historyClassificationRelatedHorse(): HistoryClassification[] {
        return this._historyClassificationRelatedHorse
    }

    get stock(): number {
        return this._stock
    }

    get dosis(): number {
        return this._dosis
    }

    get status() {
        return this._status
    }

    get locationsHistory() {
        return this._locationsHistory
    }

    static assertNotEmptyName(name: string) {
        if (name === null || name === undefined || name.trim().length === 0)
            throw new Error(this.ERROR_NAME_BLANK)
    }

    static assertNotEmptySex(sexToFind: Sex) {
        if (sexToFind === null || sexToFind === undefined )
            throw new Error(this.ERROR_INVALID_SEX)
    }

    static assertNotEmptyLocation(location: Location) {
        if (location === null || location === undefined)
            throw new Error(this.ERROR_EMPTY_LOCATION)
    }

    static assertNotEmptyShowInWeb(showInWeb: boolean) {
        if (showInWeb === null || showInWeb === undefined)
            throw new Error(this.ERROR_EMPTY_SHOW_IN_WEB)
    }

    static assertNotEmptyStatus(showInWeb: boolean) {
        if (showInWeb === null || showInWeb === undefined)
            throw new Error(this.ERROR_EMPTY_STATUS)
    }

    static named(name: string, sex: Sex, location: Location, locationDate: Date, dateOfBirth: Date,
                 veterinarian: Veterinarian, fur: Fur, AAFEFataSheet: string, pedigree: string, passport: string, observation: string,
                 showInWeb: boolean, stock: number, dosis: number, father: Horse, mother: Horse, rider: People, status: boolean, owner: People) {
        this.assertNotEmptyName(name)
        this.assertNotEmptySex(sex)
        this.assertNotEmptyLocation(location)
        this.assertNotEmptyShowInWeb(showInWeb)
        this.assertNotEmptyStatus(status)

        const newHorse = new this(name, sex, dateOfBirth, veterinarian, fur, AAFEFataSheet, pedigree, passport, observation, stock, dosis,
            showInWeb, father, mother, rider, status, owner)
        newHorse._filesData = []
        newHorse.addLocation(location, locationDate)

        return newHorse
    }

    constructor(name: string, sex: Sex, dateOfBirth: Date, veterinarian: Veterinarian, fur: Fur,
                AAFEFataSheet: string, pedigree: string, passport: string, observation: string, stock: number, dosis: number, showInWeb: boolean,
                father: Horse, mother: Horse, rider: People, status: boolean, owner: People) {
        this._name = name
        this._dateOfBirth = dateOfBirth
        this._sex = sex
        this._veterinarian = veterinarian;
        this._fur = fur;
        this._AAFEFataSheet = AAFEFataSheet;
        this._pedigree = pedigree;
        this._passport = passport,
        this._showInWeb = showInWeb;
        this._father = father;
        this._mother = mother;
        this._rider = rider;
        this._stock = stock;
        this._dosis = dosis;
        this._observation = observation
        this._status = status;
        this._owner = owner;
    }

    sexIs(sexToFind: Sex) {
        return this.sex.isSex(sexToFind)
    }

    nameIs(name: string) {
        return this.name === name
    }

    dateOfBirthIs(dateOfBirth: Date) {
        return this.dateOfBirth.getTime() === dateOfBirth.getTime()
    }

    locationIs(locationToCompare: Location) {
        return this.location.isEquals(locationToCompare)
    }

    isEqual(horseToFind: Horse): boolean {
        return horseToFind.nameIs(this.name) &&
            horseToFind.locationIs(this.location)
    }

    hasName(horseName: string): boolean {
        return horseName === this.name
    }

    veterinarianIs(veterinarianToCompare: Veterinarian) {
        return this.veterinarian.isEqual(veterinarianToCompare)
    }

    sync(newHorse: Horse): void
    {
        this._name = newHorse.name
        this._sex = newHorse.sex
        this._dateOfBirth = newHorse.dateOfBirth
        this._location = newHorse.location
        this._veterinarian = newHorse.veterinarian
        this._fur = newHorse.fur;
        this._AAFEFataSheet = newHorse.AAFEFataSheet;
        this._pedigree = newHorse.pedigree;
        this._passport = newHorse.passport;
        this._showInWeb = newHorse.showInWeb;
        this._father = newHorse.father;
        this._mother = newHorse.mother;
        this._rider = newHorse.rider;
        this._stock = newHorse.stock;
        this._dosis = newHorse.dosis;
        this._observation = newHorse._observation;
        this._status = newHorse._status;
        this._owner = newHorse._owner;
    }

    addLocation(newLocation: Location, date: Date)  {
        this._locationsHistory ||= []
        this._location = newLocation
        const newLocationHistory = LocationHorseHistory.createWith(this, newLocation, date)
        this._locationsHistory.push(newLocationHistory)
    }

    addFile(newFile: FileHorse): void
    {
        if(this._filesData === undefined || this._filesData === null)
            this._filesData = []
        this._filesData.push(newFile)
    }

    amountFiles(): number
    {
        return this._filesData.length
    }

    hasFile(newFile: FileHorse): boolean
    {
        if(this._filesData !== undefined)
            return this._filesData.some((fileData: FileHorse) => fileData.isEqual(newFile))
        return false
    }

    hasFileName(fileName: string): boolean
    {
        return this._filesData.some((fileData: FileHorse) => fileData.nameIs(fileName))
    }

    getFileWithName(fileName: string): FileHorse
    {
        const findFile = this._filesData.find((fileData: FileHorse) => fileData.nameIs(fileName))
        if(fileName === undefined)
            throw new Error(MediaCenter.FILE_NOT_FOUND)

        return findFile
    }

    amountFilesWithTag(tagFind: Tag): number
    {
        if(this._filesData !== undefined)
            return  this._filesData.filter((fileData: FileHorse) => fileData.hasThisTag(tagFind)).length
        return 0
    }

    hasThisTag(tagFind: Tag) {
        if(this._filesData !== undefined) {
            const tagFound = this._filesData.find((fileData: FileHorse) => fileData.hasThisTag(tagFind))
            if(tagFound !== undefined)
                return true
        }
        return false
    }

    hasTag() {
        if(this._filesData !== undefined) {
            const tagFound = this._filesData.find((fileData: FileHorse) => fileData.hasTag())
            if(tagFound !== undefined)
                return true
        }
        return false
    }

    hasFur() {
        if(this.fur === null || this.fur === undefined )
            return false
        return true
    }

    hasAAFEFataSheet() {
        if(this.AAFEFataSheet === null || this.AAFEFataSheet === undefined || this.AAFEFataSheet.trim().length === 0)
            return false
        return true
    }

    hasPedigree() {
        if(this.pedigree === null || this.pedigree === undefined || this.pedigree.trim().length === 0)
            return false
        return true
    }

    hasPassport() {
        if(this.passport === null || this.passport === undefined || this.passport.trim().length === 0)
            return false
        return true
    }

    hasDateOfBirth() {
        if(this.dateOfBirth === undefined || this.dateOfBirth === null)
            return false
        return true
    }

    hasVeterinarian() {
        if(this.veterinarian === undefined || this.veterinarian === null)
            return false
        return true
    }

    furIs(fur: Fur) {
        return this.fur.isEquals(fur)
    }

    AAFEFataSheetIs(aafeFataSheet: string) {
        return this.AAFEFataSheet === aafeFataSheet
    }

    pedigreeIs(pedigree: string) {
        return this.pedigree === pedigree
    }

    passportIs(passport: string) {
        return this.passport === passport
    }

    hasFather() {
        if(this.father === undefined || this.father === null)
            return false
        return true
    }

    hasMother() {
        if(this.mother === undefined || this.mother === null)
            return false
        return true
    }

    hasRider() {
        if(this.rider === undefined || this.rider === null)
            return false
        return true
    }

    fatherIs(horseFather: Horse) {
        if(this.hasFather())
            return this.father.isEqual(horseFather)
        return false
    }

    motherIs(horseMother: Horse) {
        if(this.hasMother())
            return this.mother.isEqual(horseMother)
        return false
    }

    riderIs(horseRider: People) {
        if(this.hasRider())
            return this.rider.isEqual(horseRider)
        return false
    }

    addImageProfile(imageProfile: FileHorse) {
        this._imageProfile = imageProfile
    }

    hasImageProfile(): boolean
    {
        return this.imageProfile !== null && this.imageProfile !== undefined
    }

    imageProfileIs(imageProfile: FileHorse): boolean
    {
        if(this.hasImageProfile())
            return this.imageProfile.isEqual(imageProfile)
        return false
    }

    deleteImageProfile() {
        this._imageProfile = null;
    }

    delete(){
        this._deleted = true
    }

    getFileURL() {
        return this.filesData.map(file => file.url)
    }

    toJSON()
    {
        return {
            "id": this?.id,
            "name": this.name,
            "dateOfBirth": this.dateOfBirth,
            "location": this.location,
            "sex": this.sex,
            "veterinarian": this.veterinarian,
            "fur": this.fur,
            "AAFEFataSheet": this.AAFEFataSheet,
            "pedigree": this.pedigree,
            "passport": this.passport,
            "showInWeb": this.showInWeb,
            "imageProfile": this.imageProfile,
            "mother": this.mother,
            "father": this.father,
            "rider": this.rider,
            "owner": this.owner,
            "stock": this.stock,
            "dosis": this.dosis,
            "observation": this.observation,
            "status": this.status,
            "startDressage": this._startDressage,
            "endDressage": this._endDressage,
            "historyClassification": this._historyClassificationHorse,
            "horseURL": `${process.env.FRONT_SERVER}/backoffice/horses/${this?.id}`
        }
    }

    toJSONExport()
    {
        return {
            "id": this?.id,
            "name": this.name,
            "dateOfBirth": this.dateOfBirth,
            "location": this.location != null ? this.location.name : "",
            "sex": this.sex != null ? getTranslation(this.sex.value) : "",
            "veterinarian": this.veterinarian != null ? this.veterinarian.firstName + " " + this.veterinarian.lastName : "",
            "fur": this.fur!= null ? getTranslation(this.fur.value) : "",
            "pedigree": this.pedigree,
            "passport": this.passport,
            "showInWeb": this.showInWeb,
            "mother": this.mother != null ? this.mother.name : "",
            "father": this.father != null ? this.father.name : "",
            "rider": this.rider != null ? this.rider.firstName + " " + this.rider.lastName : "",
            "owner": this.owner != null ? this.owner.firstName + " " + this.owner.lastName : "",
            "stock": this.stock,
            "dosis": this.dosis,
            "observation": htmlToText(this.observation),
            "status": this.status,
            "startDressage": this._startDressage,
            "endDressage": this._endDressage,
            "horseURL": `${process.env.FRONT_SERVER}/backoffice/horses/${this?.id}`
        }
    }

    toJSONReport()
    {
        return {
            "id": this?.id,
            "name": this.name,
            "location": this.location != null ? this.location.name : "",
            "sex": this.sex != null ? this.sex.value : "",
            "horseURL": `${process.env.FRONT_SERVER}/backoffice/horses/${this?.id}`
        }
    }

    toJSONSimple()
    {
        return {
            "id": this?.id,
            "name": this.name
        }
    }
}