import {Horse} from "./Horse";
import {FileHorse} from "../MediaCenters/FileHorse";
import {MediaCenter} from "../MediaCenters/MediaCenter";
import {HistoryClassifications} from "../HistoryClassification/HistoryClassifications";
import {LocationHorseHistory} from "./LocationHorseHistory";

export abstract class Horses {
    static readonly ERROR_CAN_NOT_ADD_DUPLICATED_HORSE = "Can not add duplicated Horse";
    static readonly ERROR_CAN_NOT_FOUND_HORSE = "Can not found horse"

    protected _store: MediaCenter;
    protected _historyClassifications: HistoryClassifications;

    async assertDuplicatedHorse(horse: Horse) {
        if (await this.hasHorse(horse))
            throw new Error(Horses.ERROR_CAN_NOT_ADD_DUPLICATED_HORSE)
    }

    abstract add(name: string, sexId: number, locationId: number, locationDate: Date, dateOfBirthAsString: string,
                veterinarianId: number, furId: number, AAFEFataSheet: string, pedigree: string, passport: string, stock: number, dosis: number,
                observation: string, showInWeb: boolean, fatherId: number, motherId: number, riderId: number, imageProfileName: string, 
                imageProfileArrayBuffer: ArrayBuffer, clasificationKey: string, relatedHorseId: number, status: boolean, classificationDate: Date, owner: number): Promise<Horse>

    abstract getAll(): Promise<Horse[]>;

    abstract getAllSimplify(): Promise<{ id: number; name: string; }[]>

    abstract amount(): any;

    abstract hasHorse(horseToFind: Horse): Promise<boolean>

    abstract hasHorseNamed(horseName: string): Promise<boolean>;

    abstract findByName(horseName: string, failedClosure: () => void): Promise<any | void>;

    abstract findById(horseId: number, failedClosure: () => void): Promise<any | void>;

    abstract update(id: number, name: string, sexId: number, dateOfBirth: Date, veterinarianId: number,
                    furId: number, AAFEFataSheet: string, pedigree: string, passport: string, showInWeb: boolean, observation: string,
                    fatherId: number, motherId: number, riderId: number, imageProfileName: string,
                    imageProfileArrayBuffer: ArrayBuffer, stock: number,  dosis: number, status: boolean, owner: number): Promise<Horse>

    abstract addImageProfile(id: number, fileName: string, arrayBuffer: ArrayBuffer): Promise<FileHorse>

    addStore(store: MediaCenter) {
        this._store = store
    }

    addHistoryClassification(history: HistoryClassifications) {
        this._historyClassifications = history;
    }

    abstract hasImageProfile(horseId: number): Promise<boolean>

    abstract filter(search: string, filters: any, page: number, limit: number, order: any): Promise<Horse[]>

    abstract softDelete(horseId: number): Promise<void>;

    abstract findImagesByIdAndType(horseId: number, type: string, limit: number, page: number): Promise<string[]>;

    abstract findBySexId(sexId: number, failedClosure: () => void): Promise<any | void>;

    abstract changeStock(horseId: number, stock: number,  dosis: number): Promise<void>;

    abstract filterShowInWeb(search: string, filters: any, page: number, limit: number, order: any): Promise<Horse[]>;

    abstract changeLocation(horseId: number, locationId: number, date: Date): Promise<void>;

    abstract findAllLocationsByHorse(horseId: number, page: number, limit: number): Promise<LocationHorseHistory[]>;

    abstract findLastLocationByHorse(horseId: number): Promise<LocationHorseHistory> ;

    abstract getYeguaGestanteWhitLastCycle(page: number, limit: number): Promise<any>;
    
    abstract getYeguaGestanteWhitLastCycleExport(page: number, limit: number): Promise<any>;

    abstract exportHorses() : any;

    abstract horsesLocations(search: string, filters: any, page: number, limit: number, order: any) : any;

    abstract exportHorsesLocations(search: string, filters: any, page: number, limit: number, order: any) : any;
    
    abstract getLocationHistory(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> 
}

