/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Horse} from "./Horse";
import {Horses} from "./Horses";
import {Locations} from "../Locations/Locations";
import {Peoples} from "../Peoples/Peoples";
import {FileHorse} from "../MediaCenters/FileHorse";
import {ValuesLists} from "../ValuesList/ValuesLists";
import {LocationHorseHistory} from "./LocationHorseHistory";

export class TransientHorses extends Horses {
    getAllSimplify(): Promise<{ id: number; name: string; }[]> {
        throw new Error("Method not implemented.");
    }
    getYeguaGestanteWhitLastCycleExport(page: number, limit: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getLocationHistory(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    exportHorsesLocations(search: string, filters: any, page: number, limit: number, order: any) {
        throw new Error("Method not implemented.");
    }
    horsesLocations(search: string, filters: any, page: number, limit: number, order: any) {
        throw new Error("Method not implemented.");
    }
    exportHorses() {
        throw new Error("Method not implemented.");
    }
    getYeguaGestanteWhitLastCycle(page: number, limit: number): Promise<Horse[]> {
        throw new Error("Method not implemented.");
    }
    filterShowInWeb(search: string, filters: any, page: number, limit: number, order: any): Promise<Horse[]> {
        throw new Error("Method not implemented.");
    }
    addEducation(idHorse: number, idLocation: number, idResponsible: number, imageName: string, imageArrayBuffer: ArrayBuffer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    private _horses: Map<number, Horse>
    private _lastId = 0
    private _locations: Locations;
    private _peoples: Peoples;

    constructor(horses: Map<number, Horse>, locations: Locations, peoples: Peoples, valuesList: ValuesLists) {
        super();
        this._locations = locations;
        this._horses = horses
        this._peoples = peoples
    }

    findBySexId(sexId: number, failedClosure: () => void): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    async add(name: string, sexId: number, locationId: number, locationDate: Date, dateOfBirthAsString: string,
              veterinarianId: number, furId: number, AAFEFataSheet: string, pedigree: string, passport:string, stock: number, dosis: number,
              observation: string, showInWeb: boolean, fatherId: number, motherId: number, riderId: number, imageProfileName: string, imageProfileArrayBuffer: ArrayBuffer, clasificationKey: string, relatedHorseId: number, status: boolean, classificationDate: Date): Promise<Horse> {

        const dateOfBirth = new Date(dateOfBirthAsString)
        const veterinarian = await this._peoples.findVeterinarianById(veterinarianId, ()=> {
            throw new Error(Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        })
        const location = await this._locations.findById(locationId,
            ()=>{throw new Error(Locations.ERROR_LOCATION_NOT_FOUND)})
        let father = null
        if(fatherId !== undefined && fatherId !== null) {
            father = await this.findById(fatherId,
                () => {throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)})
        }
        let mother = null
        if(motherId !== undefined && motherId !== null) {
            mother = await this.findById(motherId,
                () => {throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)})
        }
        let rider = null
        if(riderId !== null && riderId !== undefined) {
            rider = await this._peoples.findPeopleById(riderId,
                () => {throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)})
        }
        // @ts-ignore
        const newHorse = Horse.named(name, sexId, location, locationDate, dateOfBirth, veterinarian, furId, AAFEFataSheet, pedigree,passport, observation, showInWeb, stock, dosis, father, mother, rider, status)
        await this.assertDuplicatedHorse(newHorse)
        this._horses.set(this._lastId, newHorse)
        this._lastId++
        return newHorse
    }

    async getAll():Promise<Horse[]>
    {
        return Array.from(this._horses.values())
    }

    amount() {
        return this._horses.size
    }

    async hasHorseNamed(horseName: string): Promise<boolean> {
        const horses = await this.getAll()
        return horses.some((horse: Horse) => horse.hasName(String(horseName)))
    }

    async hasHorse(horseToFind: Horse): Promise<boolean> {
        return await this.hasHorseNamed(horseToFind.name)
    }

    findByName(horseName: string, failedClosure: () => void): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async findById(horseId: number, failedClosure: ()=> void){
        const horseFound = this._horses.get(horseId)

        if(horseFound === undefined)
            return failedClosure()
        return horseFound
    }

    update(id: number, name: string, sexId: number, dateOfBirth: Date, veterinarianId: number,
           furId: number, AAFEFataSheet: string, pedigree: string,passport:string, showInWeb: boolean, observation: string,
           fatherId: number, motherId: number, riderId: number, imageProfileName: string,
           imageProfileArrayBuffer: ArrayBuffer, stock: number,  dosis: number, status: boolean): Promise<Horse>{
        throw new Error("Method not implemented.");
    }

    addImageProfile(id: number, fileName: string, arrayBuffer: ArrayBuffer): Promise<FileHorse> {
        return undefined;
    }

    async hasImageProfile(horseId: number): Promise<boolean> {
        return false;
    }

    filter(search: string, filters: any, page: number, limit: number, order: any): Promise<Horse[]> {
        return Promise.resolve([]);
    }

    softDelete(horseId: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    findImagesByIdAndType(horseId: number, type: string, limit: number, page: number): Promise<string[]> {
        return Promise.resolve([]);
    }

    changeStock(horseId: number, stock: number,  dosis: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    changeLocation(horseId: number, locationId: number, date: Date): Promise<void> {
        return Promise.resolve(undefined);
    }

    findAllLocationsByHorse(horseId: number, page: number, limit: number): Promise<LocationHorseHistory[]> {
        return Promise.resolve([]);
    }

    findLastLocationByHorse(horseId: number): Promise<LocationHorseHistory> {
        return Promise.resolve(undefined);
    }

    getAllHorseWhitLastClassification(): Promise<Horse[]> {
        return Promise.resolve([]);
    }

}