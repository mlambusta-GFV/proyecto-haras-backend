import { FileHorse } from "./FileHorse";
import { Horse } from "../Horse/Horse";
import { createQueryBuilder, QueryRunner } from "typeorm";
import * as fs from "fs";
import { MediaCenter } from "./MediaCenter";
import { Tag } from "./Tag";
import { Horses } from "../Horse/Horses";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { FileType } from "../ValuesList/ValueList";
import { Interventions } from "../ClinicHistory/Interventions";
import { FileAttachment } from "./FileAttachment";
import { FileGeneric } from "./FileGeneric";
import { FileEducation } from "./FileEducation";
import { Locations } from "../Locations/Locations";
import { Peoples } from "../Peoples/Peoples";
import { People } from "../Peoples/People";
import { FileTraining } from "./FileTraining";
import { group } from "console";
import { Filter } from "../Provider/Filter";
const sharp = require("sharp");

export class FileSystemMediaCenter extends MediaCenter {


    private _queryRunner: QueryRunner;
    private readonly _horseDirectory: string;
    private _horses: Horses;
    private _valuesList: ValuesLists;
    private _locations: Locations;
    private _peoples: Peoples;
    private _filterTraining: Filter;
    private _filterEducation: Filter;

    static ERROR_INVALID_FILTER_TYPE = "This filter is invalid"
    static ERROR_INVALID_FILTER_CONDITION = "This condition is invalid"
    static ERROR_INVALID_FILTER_NAME = "This name is invalid";

    constructor(queryRunner: QueryRunner, horseDirectory: string, horses: Horses, valuesList: ValuesLists,
        locations: Locations, peoples: Peoples) {
        super();
        this._queryRunner = queryRunner;
        this._horseDirectory = horseDirectory;
        this._horses = horses
        this._valuesList = valuesList
        this._locations = locations;
        this._peoples = peoples;
        this._filterTraining = Filter.initialize("FileTraining",
            ["id", "horse", "jump", "date", "result", "club", "deleted", "horseRider", "horse._name"],
            ["equal", "like", "between"], ["string", "boolean", "object", "date"], ["horse._name", "club"]);
        this._filterEducation = Filter.initialize("FileEducation",
            ["id", "horse", "location", "date", "responsible", "description", "deleted", "name", "horse._name", "location._name"],
            ["equal", "like", "between"], ["string", "boolean", "object", "date"], ["horse._name", "description", "location._name"]);
    }

    private assertHasValues(filters: [{ name: string, values: [], condition: string, type: string }]): void {
        const isValidCondition = filters.every(filter => {
            if (filter.values !== undefined)
                return filter.values.length > 0
            return true
        })
        if (!isValidCondition) {
            throw new Error(FileSystemMediaCenter.ERROR_INVALID_FILTER_CONDITION)
        }
    }

    get horseDirectory(): string {
        return this._horseDirectory
    }

    private getFileExtension(nameFile: string): string {
        const dotPosition = nameFile.lastIndexOf(".")
        return nameFile.slice(dotPosition + 1)
    }

    private async getFileTypeName(nameFile: string): Promise<FileType> {
        const fileExtension = this.getFileExtension(nameFile)
        const fileType = await this._valuesList.findTypeByExtensionFile(fileExtension, () => {
            throw new Error(MediaCenter.ERROR_FILE_TYPE_NOT_SPORTED)
        })

        return <FileType>fileType
    }

    async addHorseFile(nameFile: string, description: string, data: ArrayBuffer, horse: Horse, tagsId: number[], showInWeb: boolean, name: string, date: Date): Promise<FileHorse> {
        const fileType: FileType = await this.getFileTypeName(nameFile)
        const tags = await Promise.all(tagsId.map(async tagId => {
            return await this.findTagById(tagId, () => {
                throw new Error(MediaCenter.ERROR_TAG_NOT_FOUND)
            })
        }))
        // @ts-ignore
        const newFile = FileHorse.createHorse(this.horseDirectory, nameFile, description, fileType, horse, tags, showInWeb, name, date)
        await this.assertNotDuplicatedFile(newFile)
        await this.saveFile(newFile, Buffer.from(data))
        await this._queryRunner.manager.save(newFile);
        //horse.addFile(newFile)
        //await this._queryRunner.manager.save(horse);

        return newFile
    }

    async findFileHorseById(idHorse: number, failedClosure: () => any) {
        const fileFound = await this._queryRunner
            .manager
            .findOne(FileHorse, { where: { _id: idHorse } })
        if (fileFound === undefined)
            failedClosure()
        return fileFound
    }

    async updateHorseFile(idHorse: number, showInWeb: boolean, name: string, date: Date): Promise<FileHorse> {
        const fileHorse = await this.findFileHorseById(idHorse, () => {
            throw new Error(MediaCenter.ERROR_CAN_NOT_FIND_HORSE_IN_UPDATE)
        })
        fileHorse.showInWeb = showInWeb
        fileHorse.name = name
        fileHorse.date = date
        await this._queryRunner.manager.save(fileHorse);
        return fileHorse
    }

    protected assertNotEmptyImage(imageName: string, imageArrayBuffer: ArrayBuffer) {
        if (imageName === null || imageName === undefined
            || imageArrayBuffer === null || imageArrayBuffer === undefined) {
            throw new Error(MediaCenter.ERROR_EDUCATION_IMAGES_CAN_NOT_BE_EMPTY)
        }
    }

    async deleteFile(idFile: number) {
        const file = await this.findById(idFile)
        file.delete()
        await this._queryRunner.manager.save(file);
    }

    async getAllShowInWeb(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        const fileFound = await createQueryBuilder("FileHorse")
            .leftJoinAndSelect("FileHorse._horse", "horse")
            .leftJoinAndSelect("FileHorse._type", "type")
            .where("FileHorse._deleted = false AND FileHorse._showInWeb = true")
            .skip(skip)
            .take(limit)
            .getManyAndCount()
        return fileFound
    }

    async addEducationFile(nameFile: string, description: string, data: ArrayBuffer, horseId: number, locationId: number,
        idResponsible: number, showInWeb: boolean, name: string, date: Date): Promise<FileHorse> {
        const fileType: FileType = await this.getFileTypeName(nameFile)
        this.assertNotEmptyImage(nameFile, data)
        const horse = <Horse>await this._horses.findById(horseId,
            () => {
                throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
            })
        let location = null
        if (locationId !== null && locationId !== undefined) {
            location = await this._locations.findById(locationId,
                () => {
                    throw new Error(Locations.ERROR_LOCATION_NOT_FOUND)
                })
        }
        let responsible = null
        if (idResponsible !== null && idResponsible !== undefined) {
            responsible = <People>await this._peoples.findHumanById(idResponsible,
                () => {
                    throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)
                })
        }
        const newFile = FileEducation.createEducation(this.horseDirectory, nameFile, description, fileType, horse, [],
            location, responsible, showInWeb, name, date)
        await this.assertNotDuplicatedFile(newFile)
        await this.saveFile(newFile, Buffer.from(data))
        await this._queryRunner.manager.save(newFile)

        return newFile
    }

    private async saveFile(newFile: FileGeneric, data: Buffer) {
        if (newFile.isImageType()) {
            newFile.convertNameToWebp()
            await sharp(Buffer.from(data))
                .webp()
                .toFile(newFile.fullPath());
        }
        else if (newFile.isVideoType()) {
            fs.appendFileSync(newFile.fullPath(), Buffer.from(data));

            if(!newFile.isMovType()) {
                const oldPath = newFile.fullPath()
                newFile.convertNameToMp4()

                const {spawn} = require("child_process");

                new Promise((resolve, reject) => {
                    const ffmpeg = spawn("ffmpeg",
                        [
                            `-i ${oldPath}`, "-vcodec h264", "-acodec aac", "-strict", "-2", ` ${newFile.fullPath()}`], {
                            shell: true
                        });
                    ffmpeg.stderr.on("data", (data: any) => {
                        console.log(data.toString()) //I'm not sure what debug is
                        console.log(newFile.fullPath())
                    });
                });
            }
        }
        else {
            fs.appendFileSync(newFile.fullPath(), Buffer.from(data));
        }
    }

    async updateEducationFile(idEducation: number, locationId: number, idResponsible: number, description: string,
        showInWeb: boolean, name: string, date: Date): Promise<void> {
        const education = await this.findEducationById(idEducation, () => {
            throw new Error(MediaCenter.ERROR_CAN_NOT_FIND_EDUCATION)
        })
        let location = null
        if (locationId !== null && locationId !== undefined) {
            location = await this._locations.findById(locationId,
                () => {
                    throw new Error(Locations.ERROR_LOCATION_NOT_FOUND)
                })
        }
        let responsible = null
        if (idResponsible !== null && idResponsible !== undefined) {
            responsible = <People>await this._peoples.findPeopleById(idResponsible,
                () => {
                    throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)
                })
        }
        education.location = location
        education.responsible = responsible
        education.description = description
        education.showInWeb = showInWeb
        education.name = name
        education.date = date
        await this._queryRunner.manager.save(education);
    }

    async amountFile() {
        return await this._queryRunner.manager.count(FileGeneric)
    }

    async hasFileWithName(fileName: string) {
        const fileFound = await this._queryRunner
            .manager
            .findOne(FileGeneric, { where: { _nameFile: fileName } })
        if (fileFound === undefined)
            return false
        return true
    }

    async hasFile(newFile: FileGeneric) {
        const fileFound = await this._queryRunner
            .manager
            .findOne(FileGeneric, { where: { _nameFile: newFile.nameFile } })
        if (fileFound === undefined)
            return false
        return true
    }

    async findNameFile(fileName: string): Promise<FileGeneric> {
        const fileFound = await this._queryRunner
            .manager
            .findOne(FileGeneric, { where: { _nameFile: fileName } })
        if (fileFound === undefined)
            throw new Error(MediaCenter.FILE_NOT_FOUND)

        return fileFound
    }

    async amountFileOfHorse(horse: Horse): Promise<number> {
        if (await this._horses.hasHorse(horse))
            return horse.amountFiles()

        throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
    }

    async amountFilesWithTag(tagFind: Tag): Promise<number> {
        const allHorses = await this._horses.getAll()
        const amountFiles = allHorses.reduce((totalFile: number, horse: Horse) => {
            return totalFile + horse.amountFilesWithTag(tagFind)
        }, 0)

        return amountFiles
    }

    async addTag(tagName: string): Promise<Tag> {
        const tag = Tag.named(tagName)
        return await this._queryRunner.manager.save(tag);
    }

    async updateTag(idTag: number, tagName: string): Promise<Tag> {
        const actualTag = await this.findTagById(idTag, () => {
            throw new Error(MediaCenter.ERROR_TAG_NOT_FOUND)
        })
        const newTag = Tag.named(tagName)
        // @ts-ignore
        actualTag.sync(newTag)
        return await this._queryRunner.manager.save(actualTag);
    }

    async getAllTags(): Promise<Tag[]> {
        return await this._queryRunner
            .manager
            .find(Tag)
    }

    async findById(id: number): Promise<FileGeneric> {
        const fileFound = await this._queryRunner
            .manager
            .findOne(FileGeneric, {
                where: { _id: id },
                relations: ["_type"]
            })
        if (fileFound === undefined)
            throw new Error(MediaCenter.FILE_NOT_FOUND)

        return fileFound
    }

    async addInterventionFile(nameFile: string, description: string, data: ArrayBuffer, intervention: Interventions): Promise<FileAttachment> {
        const fileType: FileType = await this.getFileTypeName(nameFile)

        const newFile = FileAttachment.createAttachment(this.horseDirectory, nameFile, description, fileType, intervention)
        await this.assertNotDuplicatedFile(newFile)
        await this.saveFile(newFile, Buffer.from(data))

        intervention.addAttachment(newFile);
        await this._queryRunner.manager.save(newFile);

        return newFile
    }

    protected async findTagById(idTag: number, failedClosure: () => any): Promise<Tag> {
        const tagFound = await this._queryRunner
            .manager
            .findOne(Tag, {
                where: { _id: idTag }
            })
        if (tagFound === undefined)
            return failedClosure()
        return tagFound
    }

    async findEducationById(idEducation: number, failedClosure: () => any) {
        const fileFound = await this._queryRunner
            .manager
            .findOne(FileEducation, { where: { _id: idEducation } })
        if (fileFound === undefined)
            return failedClosure()

        return fileFound
    }

    async getAllFileEducationById(idHorse: number, page: number, limit: number): Promise<any> {
        const skip = limit * page

        const fileFound = await createQueryBuilder("FileEducation")
            .leftJoinAndSelect("FileEducation._location", "location")
            .leftJoinAndSelect("FileEducation._responsible", "responsible")
            .leftJoinAndSelect("FileEducation._horse", "horse")
            .leftJoinAndSelect("FileEducation._type", "type")
            .where("horse._id = :idHorse AND FileEducation._deleted = false", { idHorse: idHorse })
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        if (fileFound === undefined)
            return []

        return fileFound
    }

    async getAllFileTrainingsById(idHorse: number, page: number, limit: number): Promise<any> {
        const skip = limit * page
        const fileFound = await createQueryBuilder("FileTraining")
            .leftJoinAndSelect("FileTraining._horseRider", "horseRider")
            .leftJoinAndSelect("FileTraining._horse", "horse")
            .leftJoinAndSelect("FileTraining._type", "type")
            .where("horse._id = :idHorse AND FileTraining._deleted = false", { idHorse: idHorse })
            .skip(skip)
            .take(limit)
            .getManyAndCount()
        if (fileFound === undefined)
            return []
        return fileFound
    }

    async getAllFileEducation(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy
        switch (order.field) {
            case "_horse":
                orderBy = {
                    "horse._name": order.order,
                }
                break;
            case "_responsible":
                orderBy = {
                    "responsible._firstName": order.order,
                    "responsible._lastName": order.order
                }
                break;
            case "_location":
                orderBy = {
                    "location._name": order.order
                }
                break;
            default:
                orderBy = {["FileEducation."+order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)

        const where = this._filterEducation.createWhere(search, filters)

        const fileFound = await createQueryBuilder("FileEducation")
            .leftJoinAndSelect("FileEducation._location", "location")
            .leftJoinAndSelect("FileEducation._responsible", "responsible")
            .innerJoinAndSelect("FileEducation._horse", "horse")
            .leftJoinAndSelect("FileEducation._type", "type")
            .where(where)
            .skip(skip)
            .take(limit)
            .orderBy("_date" !== order.field ? {...orderBy,"FileEducation._date":"DESC"} : orderBy)
            .getManyAndCount()

        if (fileFound === undefined)
            return [[], 0]

        const list = await Promise.all(fileFound[0].map(async element => {
            return {
                // @ts-ignore
                ...element.toJsonReport()
            }
        }))
        fileFound[0] = list;
        return fileFound
    }

    async getAllFileTrainings(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy
        switch (order.field) {
            case "_horse":
                orderBy = {
                    "horse._name": order.order,
                }
                break;
            case "_horseRider":
                orderBy = {
                    "horseRider._firstName": order.order,
                    "horseRider._lastName": order.order
                }
                break;
            default:
                orderBy = {["FileTraining."+order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)

        const where = this._filterTraining.createWhere(search, filters)

        const fileFound = await createQueryBuilder("FileTraining")
            .leftJoinAndSelect("FileTraining._horseRider", "horseRider")
            .innerJoinAndSelect("FileTraining._horse", "horse")
            .leftJoinAndSelect("FileTraining._type", "type")
            .where(where)
            .skip(skip)
            .take(limit)
            // @ts-ignore
            .orderBy("_date" !== order.field ? {...orderBy,"FileTraining._date":"DESC"} : orderBy)
            .getManyAndCount()

        if (fileFound === undefined)
            return [[], 0]

        const list = await Promise.all(fileFound[0].map(async element => {
            return {
                // @ts-ignore
                ...element.toJsonReport()
            }
        }))
        fileFound[0] = list;
        return fileFound
    }

    async getCompetitions(): Promise<any> {
        const group = await createQueryBuilder("FileTraining")
            .innerJoinAndSelect("FileTraining._horseRider", "horseRider")
            .innerJoinAndSelect("FileTraining._horse", "horse")
            .innerJoinAndSelect("FileTraining._type", "FileType")
            .where("FileTraining._deleted = false")
            .groupBy("FileTraining.horseRider_id , FileTraining.horse_id, FileTraining._id")
            .orderBy("FileTraining.horseRider_id", "ASC")
            .getMany();

        const result = await Promise.all(group.map(async element => {
            const competitions = await createQueryBuilder("FileTraining")
                .innerJoinAndSelect("FileTraining._type", "FileType")
                .where("FileTraining._deleted = false AND FileTraining.Horse_id = :idHorse AND FileTraining.HorseRider_id = :raider",
                    // @ts-ignore
                    { idHorse: element._horse._id, raider: element._horseRider.id })
                .orderBy("FileTraining._date", "DESC")
                .getMany()

            return {
                // @ts-ignore
                ...element.toJSON(),
                competitions: competitions
            };
        }));

        return result;
    }

    async addTrainingFile(nameFile: string, description: string, data: ArrayBuffer, horseId: number,
        idHorseRider: number, jump: string, faults: number, result: number, club: string, showInWeb: boolean, name: string, date: Date): Promise<FileTraining> {
        const fileType: FileType = await this.getFileTypeName(nameFile)
        this.assertNotEmptyImage(nameFile, data)
        const horse = <Horse>await this._horses.findById(horseId,
            () => {
                throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
            })
        let horseRider = null
        if (idHorseRider !== null && idHorseRider !== undefined) {
            horseRider = <People>await this._peoples.findPeopleById(idHorseRider,
                () => {
                    throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)
                })
        }
        const newFile = FileTraining.createFileTraining(this.horseDirectory, nameFile, description, fileType, horse, [], horseRider, jump, faults, result, club, showInWeb, name, date)
        await this.assertNotDuplicatedFile(newFile)
        await this.saveFile(newFile, Buffer.from(data))
        await this._queryRunner.manager.save(newFile)

        return newFile
    }

    async updateTrainingFile(idTraining: number, idHorseRider: number, jump: string, faults: number, result: number, club: string, description: string,
        showInWeb: boolean, name: string, date: Date): Promise<void> {
        const training = <FileTraining>await this.findTrainingById(idTraining, () => {
            throw new Error(MediaCenter.ERROR_CAN_NOT_FIND_TRAINING)
        })
        let horseRider = null
        if (idHorseRider !== null && idHorseRider !== undefined) {
            horseRider = <People>await this._peoples.findPeopleById(idHorseRider,
                () => {
                    throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)
                })
        }
        training.horseRider = horseRider
        training.jump = jump
        training.faults = faults
        training.result = result
        training.club = club
        training.description = description
        training.showInWeb = showInWeb
        training.name = name
        training.date = date
        await this._queryRunner.manager.save(training);
    }

    async findTrainingById(idTraining: number, failedClosure: () => void) {
        const fileFound = await this._queryRunner
            .manager
            .findOne(FileTraining, { where: { _id: idTraining } })
        if (fileFound === undefined)
            return failedClosure()

        return fileFound
    }


}
