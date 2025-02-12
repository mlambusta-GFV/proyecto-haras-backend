import {MediaCenter} from "./MediaCenter";
import {Horse} from "../Horse/Horse";
import {FileHorse} from "./FileHorse";
import {Tag} from "./Tag";
import {Horses} from "../Horse/Horses";
import {Interventions} from "../ClinicHistory/Interventions";
import {FileAttachment} from "./FileAttachment";
import {FileGeneric} from "./FileGeneric";
import {FileTraining} from "./FileTraining";

export class TransientMediaCenter extends MediaCenter {
    getAllFileEducation(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    getAllFileTrainings(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    getCompetitions() : Promise<any> {
        throw new Error("Method not implemented.");
    }

    deleteFile(idFile: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    private _horses: Horses;
    private _tags: Tag[];

    constructor(horses: Horses) {
        super()
        this._horses = horses
        this._tags = []
    }

    async addHorseFile(nameFile: string, description: string, data: ArrayBuffer, horse: Horse, tagsId: number[], showInWeb: boolean, name: string, date: Date): Promise<FileHorse>
    {
        const newFile = FileHorse.createHorse("", nameFile, null, null, horse, [], showInWeb, name, date)
        await this.assertNotDuplicatedFile(newFile)
        if(await this._horses.hasHorse(horse))
            horse.addFile(newFile)
        else
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)

        return Promise.resolve(newFile);
    }

    async amountFile(): Promise<any> {
        const allHorses = await this._horses.getAll()
        const amountFiles = allHorses.reduce((totalFile: number, horse: Horse) =>{
            return totalFile + horse.amountFiles()
        }, 0)

        return Promise.resolve(amountFiles)
    }

    async hasFile(newFile: FileHorse): Promise<boolean> {
        const allHorses =  await this._horses.getAll()
        const hasFile = allHorses.some((horse: Horse) => horse.hasFile(newFile))

        return Promise.resolve(hasFile)
    }

    async hasFileWithName(fileName: string): Promise<boolean> {
        const allHorses = await this._horses.getAll()
        const hasFile = allHorses.some((horse: Horse) => horse.hasFileName(fileName))

        return Promise.resolve(hasFile);
    }

    async findNameFile(nameFile: string) {
        if(await this.hasFileWithName(nameFile)){
            const allHorses = await this._horses.getAll()
            return allHorses.find(horse => horse.getFileWithName(nameFile))
        }
        throw new Error(MediaCenter.FILE_NOT_FOUND)
    }

    async amountFileOfHorse(horse: Horse): Promise<number> {
        if(await this._horses.hasHorse(horse))
            return horse.amountFiles()

        throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
    }

    async amountFilesWithTag(tagFind: Tag): Promise<number> {
        const allHorses = await this._horses.getAll()
        const amountFiles = allHorses.reduce((totalFile: number, horse: Horse) =>{
            return totalFile + horse.amountFilesWithTag(tagFind)
        }, 0)

        return amountFiles
    }

    async addTag(tagName: string): Promise<Tag> {
        return Promise.resolve(undefined);
    }

    findById(id: number): Promise<FileGeneric> {
        throw new Error("Method not implemented.");
    }

    addInterventionFile(nameFile: string, description: string, data: ArrayBuffer, intervention: Interventions): Promise<FileAttachment> {
        return Promise.resolve(undefined);
    }

    getAllTags(): Promise<Tag[]> {
        return Promise.resolve([]);
    }

    protected findTagById(idTag: number, failedClosure: () => any): Promise<Tag> {
        return Promise.resolve(undefined);
    }

    updateTag(idTag: number, tagName: string): Promise<Tag> {
        return Promise.resolve(undefined);
    }

    addEducationFile(nameFile: string, description: string, data: ArrayBuffer, horseId: number, locationId: number, idResponsible: number, showInWeb: boolean, name: string, date: Date): Promise<FileHorse> {
        return Promise.resolve(undefined);
    }

    updateEducationFile(idEducation: number, locationId: number, idResponsible: number, description: string, showInWeb: boolean, name: string, date: Date): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAllFileEducationById(idHorse: number, page: number, limit: number): Promise<any> {
        return Promise.resolve(undefined);
    }

    addTrainingFile(nameFile: string, description: string, data: ArrayBuffer, horseId: number, idHorseRider: number, jump: string, faults:number, result:number, club: string, showInWeb: boolean, name: string, date: Date): Promise<FileTraining> {
        return Promise.resolve(undefined);
    }

    updateTrainingFile(idTraining: number, idHorseRider: number, jump: string, faults: number, result: number, club: string, description: string, showInWeb: boolean, name: string, date: Date): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAllFileTrainingsById(idHorse: number, page: number, limit: number): Promise<any> {
        return Promise.resolve(undefined);
    }

    getAllShowInWeb(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        return Promise.resolve([[], 0]);
    }

    updateHorseFile(idHorse: number, showInWeb: boolean, name: string, date: Date): Promise<FileHorse> {
        return Promise.resolve(undefined);
    }
}