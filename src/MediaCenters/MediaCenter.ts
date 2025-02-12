import {FileHorse} from "./FileHorse";
import {Horse} from "../Horse/Horse";
import {Tag} from "./Tag";
import {Interventions} from "../ClinicHistory/Interventions";
import {FileAttachment} from "./FileAttachment";
import {FileGeneric} from "./FileGeneric";
import {FileTraining} from "./FileTraining";

export abstract class MediaCenter {
    static readonly ERROR_CAN_NOT_ADD_DUPLICATED_FILE = 'Can not add duplicated field';
    static readonly FILE_NOT_FOUND = 'FileGeneric not found';
    static readonly ERROR_FILE_NAME_EMPTY = 'FileGeneric name can not be empty';
    static readonly ERROR_FILE_TYPE_NOT_SPORTED = 'FileGeneric type not found';
    static readonly ERROR_TAG_NOT_FOUND = 'Can not found tag';
    static readonly ERROR_EDUCATION_IMAGES_CAN_NOT_BE_EMPTY = 'Education image can not be empty'

    static readonly ERROR_CAN_NOT_FIND_EDUCATION = 'Can not find education'
    static readonly ERROR_CAN_NOT_FIND_TRAINING  = 'Can not find training';
    static readonly ERROR_CAN_NOT_FIND_HORSE_IN_UPDATE = 'Can not find horse in update';

    async assertNotDuplicatedFile(newFile: FileGeneric) {
        if (await this.hasFile(newFile)) throw new Error(MediaCenter.ERROR_CAN_NOT_ADD_DUPLICATED_FILE)
    }

    abstract addHorseFile(nameFile: string, description: string, data: ArrayBuffer, horse: Horse, tagsId: number[], showInWeb: boolean, name: string, date: Date): Promise<FileHorse>;

    abstract amountFile(): Promise<any>;

    abstract hasFileWithName(fileName: string): Promise<boolean>;

    abstract hasFile(newFile: FileGeneric): Promise<boolean>;

    abstract findNameFile(nameFile: string): any

    abstract amountFileOfHorse(horse: Horse): Promise<number>

    abstract amountFilesWithTag(tagFind: Tag): Promise<number>

    abstract addTag(tagName: string): Promise<Tag>

    abstract findById(id: number): Promise<FileGeneric>

    abstract addInterventionFile(nameFile: string, description: string, data: ArrayBuffer, intervention: Interventions): Promise<FileAttachment>

    abstract getAllTags(): Promise<Tag[]>;

    protected abstract findTagById(idTag: number, failedClosure: () => any): Promise<Tag>;

    abstract updateTag(idTag: number, tagName: string): Promise<Tag>;

    abstract addEducationFile(nameFile: string, description: string, data: ArrayBuffer, horseId: number, locationId: number, idResponsible: number, showInWeb: boolean, name: string, date: Date): Promise<FileHorse>;

    abstract deleteFile(idFile: number): Promise<void>;

    abstract updateEducationFile(idEducation: number, locationId: number, idResponsible: number, description: string, showInWeb: boolean, name: string, date: Date): Promise<void>;

    abstract getAllFileEducationById(idHorse: number, page: number, limit: number): Promise<any>;

    abstract addTrainingFile(nameFile: string, description: string, data: ArrayBuffer, horseId: number,
                             idHorseRider: number, jump: string, faults:number, result:number, club: string, showInWeb: boolean, name: string, date: Date): Promise<FileTraining>;

    abstract updateTrainingFile(idTraining: number, idHorseRider: number, jump: string, faults:number, result:number, club: string, description: string, showInWeb: boolean, name: string, date: Date): Promise<void>;

    abstract getAllFileTrainingsById(idHorse: number, page: number, limit: number): Promise<any>;

    abstract getAllFileTrainings(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>;

    abstract getAllShowInWeb(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>;

    abstract updateHorseFile(idHorse: number, showInWeb: boolean, name: string, date: Date): Promise<FileHorse>;

    abstract getCompetitions(): Promise<any>;

    abstract getAllFileEducation(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>;
}

