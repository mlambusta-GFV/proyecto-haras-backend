/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Horse } from "./Horse";
import { createQueryBuilder, QueryRunner } from "typeorm";
import { Horses } from "./Horses";
import { Locations } from "../Locations/Locations";
import { Peoples } from "../Peoples/Peoples";
import { FileHorse } from "../MediaCenters/FileHorse";
import { Filter } from "../Provider/Filter";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { Sex } from "../ValuesList/ValueList";
import { Veterinarian } from "../Peoples/Veterinarian";
import { People } from "../Peoples/People";
import { LocationHorseHistory } from "./LocationHorseHistory";
import { HistoryClassifications } from "../HistoryClassification/HistoryClassifications";

export class PersistentHorses extends Horses {
    private _queryRunner: QueryRunner;
    private _locations: Locations;
    private _peoples: Peoples;
    private _valueList: ValuesLists
    private _filter: Filter;
    private _filterLocationsxHorse: Filter;

    static ERROR_INVALID_FILTER_TYPE = "This filter is invalid"
    static ERROR_INVALID_FILTER_CONDITION = "This condition is invalid"
    static ERROR_INVALID_FILTER_NAME = "This name is invalid";

    constructor(queryRunner: QueryRunner, locations: Locations, peoples: Peoples, valueList: ValuesLists) {
        super()
        this._queryRunner = queryRunner;
        this._locations = locations;
        this._peoples = peoples;
        this._valueList = valueList;
        this._filter = Filter.initialize("Horse",
            ["id", "name", "location", "sex", "fur", "showInWeb", "deleted", "status"],
            ["equal", "like"], ["string", "boolean", "object"], ["name"]);
        this._filterLocationsxHorse = Filter.initialize("LocationHorseHistory",
            ["id", "horse", "location", "date", "departureDate", "location._name", "horse._name", "status", "responsible", "personCharge"],
            ["equal", "like", "between", "<", ">", "<=", ">="], ["string", "boolean", "object", "date"], ["location._name", "horse._name"]);
    }

    async findBySexId(sexId: number, failedClosure: () => void): Promise<any> {

        const column: any = {};
        column._name = "ASC";
        column._id = "DESC";
        const horseFound = await this._queryRunner
            .manager
            .find(Horse, {
                where: { _sex: sexId, _deleted: false},
                order: column
            })
        if (horseFound === undefined)
            return failedClosure()
        return horseFound
    }

    async add(name: string, sexId: number, locationId: number, locationDate: Date, dateOfBirthAsString: string,
        veterinarianId: number, furId: number, AAFEFataSheet: string, pedigree: string, passport: string, stock: number, dosis: number,
        observation: string, showInWeb: boolean, fatherId: number, motherId: number, riderId: number,
        imageProfileName: string, imageProfileArrayBuffer: ArrayBuffer, clasificationKey: string, relatedHorseId: number,
        status: boolean, classificationDate: Date, ownerId: number): Promise<Horse> {
        const dateOfBirth = new Date(dateOfBirthAsString)

        const location = await this._locations.findById(locationId, () => { throw new Error(Locations.ERROR_LOCATION_NOT_FOUND) })
        const sex = <Sex>await this._valueList.findBySexId(sexId, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })

        let veterinarian = null
        if (veterinarianId !== null && veterinarianId !== undefined) {
            veterinarian = <Veterinarian>await this._peoples.findVeterinarianById(veterinarianId, () => {
                throw new Error(Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
            })
        }

        let fur = null
        if (furId !== undefined && furId !== null) {
            fur = await this._valueList.findByFurId(furId, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        }

        let father = null
        if (fatherId !== undefined && fatherId !== null) {
            father = <Horse>await this.findById(fatherId,
                () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        }

        let mother = null
        if (motherId !== undefined && motherId !== null) {
            mother = <Horse>await this.findById(motherId,
                () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        }

        let rider = null
        if (riderId !== null && riderId !== undefined) {
            rider = <People>await this._peoples.findPeopleById(riderId,
                () => { throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE) })
        }

        let owner = null
        if (ownerId !== null && ownerId !== undefined) {
            owner = <People>await this._peoples.findPeopleById(ownerId,
                () => { throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE) })
        }


        const newHorse = Horse.named(name, sex, location, locationDate, dateOfBirth, veterinarian, fur, AAFEFataSheet,
            pedigree, passport, observation, showInWeb, stock, dosis, father, mother, rider, status,owner)

        await this._queryRunner.manager.save(newHorse);

        if (imageProfileName !== null && imageProfileName !== undefined
            && imageProfileArrayBuffer !== null && imageProfileArrayBuffer !== undefined) {
            const date = new Date()
            const newFileData = await this._store.addHorseFile(imageProfileName, null, imageProfileArrayBuffer,
                newHorse, [], showInWeb, name, date)
            // @ts-ignore
            newHorse.addImageProfile(newFileData);
            await this._queryRunner.manager.save(newHorse);
        }

        const noApto = await this._valueList.findByClasificationNamekey(clasificationKey, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        // @ts-ignore
        const history = await this._historyClassifications.add(noApto.id, classificationDate, newHorse.id, relatedHorseId, 0, "Creacion de caballo", stock, dosis)

        return newHorse
    }

    async amount() {
        return await this._queryRunner.manager.count(Horse)
    }

    async assertDuplicatedHorse(horse: Horse) {
        if (await this.hasHorse(horse)) throw new Error(PersistentHorses.ERROR_CAN_NOT_ADD_DUPLICATED_HORSE)
    }

    async getAll(): Promise<Horse[]> {
        return await this._queryRunner.manager.find(Horse, {
            where: { _deleted: 0 },
            relations: ["_veterinarian", "_location", "_filesData", "_filesData._tags", "_imageProfile", "_father",
                "_mother", "_rider", "_imageProfile._type", "_sex", "_fur", "_owner"]
        }
        )
    }

    async getAllSimplify(): Promise<{ id: number; name: string; }[]> {
        const horses = await this._queryRunner.manager.find(Horse, { where: { _deleted: 0 } } )

        const result = horses.map(element => {
            return element.toJSONSimple();
        })
        return result
    }

    async hasHorse(horseToFind: Horse): Promise<boolean> {
        return await this.hasHorseNamed(horseToFind.name)
    }

    async hasHorseNamed(horseName: string): Promise<boolean> {
        const findHorse = await this.findByName(horseName, () => false)
        if (findHorse)
            return true
        return false;
    }

    async findByName(horseName: string, failedClosure: () => void): Promise<Horse | void> {
        const horseFound = await this._queryRunner
            .manager
            .findOne(Horse, { where: { _name: horseName } })
        if (horseFound === undefined)
            return failedClosure()
        return horseFound
    }

    async findById(horseId: number, failedClosure: () => void): Promise<Horse | void> {
        const horseFound = await this._queryRunner
            .manager
            .findOne(Horse, {
                where: { _id: horseId },
                relations: ["_veterinarian", "_location", "_filesData", "_filesData._tags", "_imageProfile", "_father",
                    "_mother", "_rider", "_sex", "_fur", "_location._personCharge", "_imageProfile._type", "_locationsHistory", "_owner"]
            })
        if (horseFound === undefined)
            return failedClosure()
        return horseFound
    }

    async assertDuplicatedPlayerUpdate(actualHorse: Horse, newHorse: Horse) {
        if (actualHorse.name !== newHorse.name) await this.assertDuplicatedHorse(newHorse)
    }

    async changeStock(horseId: number, stock: number, dosis: number,) {
        const horseFound = <Horse>await this.findById(horseId, () => {
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
        })
        const newStock = horseFound.stock + stock
        const newDosis = horseFound.dosis + dosis
        await createQueryBuilder()
            .update(Horse)
            .set({
                _stock: newStock,
                _dosis: newDosis
            })
            .where("_id = :id", { id: horseFound.id })
            .execute();
    }

    async changeLocation(horseId: number, locationId: number, date: Date) {
        const horseFound = <Horse>await this.findById(horseId, () => {
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
        })
        const location = await this._locations.findById(locationId, () => {
            throw new Error(Locations.ERROR_LOCATION_NOT_FOUND)
        })
        const lastLocationHistory = await this.findLastLocationByHorse(horseId)
        lastLocationHistory.setDepartureDate(date)

        horseFound.addLocation(location, date)

        await createQueryBuilder()
            .update(LocationHorseHistory)
            .set({
                _departureDate: date,
            })
            .where("_id = :id", { id: lastLocationHistory.id })
            .execute();

        await createQueryBuilder()
            .update(Horse)
            .set({
                _location: location,
            })
            .where("_id = :id", { id: horseFound.id })
            .execute();

        await createQueryBuilder()
            .insert()
            .into(LocationHorseHistory)
            .values({
                _horse: horseFound,
                _location: location,
                _date: date
            })
            .execute()
    }

    async update(id: number, name: string, sexId: number, dateOfBirth: Date, veterinarianId: number,
        furId: number, AAFEFataSheet: string, pedigree: string, passport: string, showInWeb: boolean, observation: string,
        fatherId: number, motherId: number, riderId: number, imageProfileName: string,
        imageProfileArrayBuffer: ArrayBuffer, stock: number, dosis: number, status: boolean, ownerId: number): Promise<Horse> {

        const horseFound = <Horse>await this.findById(id, () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        const sexFound = await this._valueList.findBySexId(sexId, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })

        let veterinarian = null
        if (veterinarianId !== null && veterinarianId !== undefined) {
            veterinarian = <Veterinarian>await this._peoples.findVeterinarianById(veterinarianId, () => {
                throw new Error(Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
            })
        }

        let fur = null
        if (furId !== undefined && furId !== null) {
            fur = await this._valueList.findByFurId(furId, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        }
        let father = null
        if (fatherId !== undefined && fatherId !== null) {
            father = await this.findById(fatherId,
                () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        }
        let mother = null
        if (motherId !== undefined && motherId !== null) {
            mother = await this.findById(motherId,
                () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        }
        let rider = null
        if (riderId !== null && riderId !== undefined) {
            rider = await this._peoples.findPeopleById(riderId,
                () => { throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE) })
        }
        let owner = null
        if (ownerId !== null && ownerId !== undefined) {
            owner = await this._peoples.findPeopleById(ownerId,
                () => { throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE) })
        }

        const fakeDate = new Date()
        // @ts-ignore
        const newHorse = Horse.named(name, sexFound, horseFound.location, fakeDate, dateOfBirth, veterinarian, fur, AAFEFataSheet, pedigree, passport, observation, showInWeb, stock, dosis, father, mother, rider, status,owner)

        // @ts-ignore
        //await this.assertDuplicatedPlayerUpdate(horseFound, newHorse)
        // @ts-ignore
        horseFound.sync(newHorse)

        if (imageProfileName !== null && imageProfileName !== undefined
            && imageProfileArrayBuffer !== null && imageProfileArrayBuffer !== undefined) {
            const date = new Date()
            const newFileData = await this._store.addHorseFile(imageProfileName, null, imageProfileArrayBuffer, horseFound, [], showInWeb, name, date)
            await this._queryRunner.commitTransaction()
            await this._queryRunner.startTransaction()
            // @ts-ignore
            horseFound.addImageProfile(newFileData);
        }

        await createQueryBuilder()
            .update(Horse)
            .set({
                _name: horseFound.name,
                _sex: horseFound.sex,
                _dateOfBirth: horseFound.dateOfBirth,
                _location: horseFound.location,
                _veterinarian: horseFound.veterinarian,
                _fur: horseFound.fur,
                _AAFEFataSheet: horseFound.AAFEFataSheet,
                _pedigree: horseFound.pedigree,
                _passport: horseFound.passport,
                _showInWeb: horseFound.showInWeb,
                _father: horseFound.father,
                _mother: horseFound.mother,
                _rider: horseFound.rider,
                _stock: horseFound.stock,
                _dosis: horseFound.dosis,
                _observation: horseFound.observation,
                _status: horseFound.status,
                _imageProfile: horseFound.imageProfile,
                _owner: horseFound.owner
            })
            .where("_id = :id", { id: horseFound.id })
            .execute();

        //await this._queryRunner.manager.save(horseFound);
        // @ts-ignore
        return horseFound
    }

    async addImageProfile(idHorse: number, fileName: string, arrayBuffer: ArrayBuffer): Promise<FileHorse> {
        const horse = await this.findById(idHorse, () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        // @ts-ignore
        const newFileData = await this._store.addHorseFile(fileName, description, arrayBuffer, horse, [], showInWeb, name, date)
        // @ts-ignore
        horse.addImageProfile(newFileData);
        await this._queryRunner.manager.save(horse);
        return newFileData
    }

    async hasImageProfile(horseId: number): Promise<boolean> {
        const horse = await this.findById(horseId, () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
        // @ts-ignore
        return horse.hasImageProfile()
    }

    private assertHasValues(filters: [{ name: string, values: [], condition: string, type: string }]): void {
        if (filters !== undefined) {
            const isValidCondition = filters.every(filter => {
                if (filter.values !== undefined)
                    return filter.values.length > 0
                return true
            })
            if (!isValidCondition) {
                throw new Error(PersistentHorses.ERROR_INVALID_FILTER_CONDITION)
            }
        }
    }

    async filter(search: string, filters: any, page: number, limit: number, order: any): Promise<Horse[]> {
        const skip = limit * page
        if (order === undefined || order === null) {
            order = {
                field: "id",
                order: "DESC"
            }
        }

        filters.push({
            name: "deleted",
            values: ["false"],
            condition: "equal",
            type: "boolean"
        })

        this.assertHasValues(filters)

        const where = this._filter.createWhere(search, filters)
        // @ts-ignore
        const horseFound: Horse[] = await createQueryBuilder("Horse")
            .leftJoinAndSelect("Horse._location", "location")
            .leftJoinAndSelect("location._personCharge", "personCharge")
            .leftJoinAndSelect("Horse._veterinarian", "veterinarian")
            .leftJoinAndSelect("Horse._rider", "rider")
            .leftJoinAndSelect("Horse._sex", "sex")
            .leftJoinAndSelect("Horse._fur", "fur")
            .leftJoinAndSelect("Horse._imageProfile", "imageProfile")
            .leftJoinAndSelect("imageProfile._type", "type")
            .leftJoinAndSelect("Horse._mother", "mather")
            .leftJoinAndSelect("Horse._father", "father")
            .leftJoinAndSelect("Horse._owner", "owner")
            .where(where)
            .orderBy("Horse._" + order.field, order.order)
            .skip(skip)
            .take(limit)
            .getManyAndCount()
        return horseFound
    }

    async filterShowInWeb(search: string, filters: any, page: number, limit: number, order: any): Promise<Horse[]> {
        const skip = limit * page
        if (order === undefined || order === null) {
            order = {
                field: "id",
                order: "DESC"
            }
        }
        filters.push({
            name: "deleted",
            values: ["false"],
            condition: "equal",
            type: "boolean"
        })
        filters.push({
            name: "showInWeb",
            values: ["true"],
            condition: "equal",
            type: "boolean"
        })
        this.assertHasValues(filters)
        const where = this._filter.createWhere(search, filters)
        // @ts-ignore
        const horseFound: Horse[] = await createQueryBuilder("Horse")
            .leftJoinAndSelect("Horse._rider", "rider")
            .leftJoinAndSelect("Horse._sex", "sex")
            .leftJoinAndSelect("Horse._fur", "fur")
            .leftJoinAndSelect("Horse._imageProfile", "imageProfile")
            .leftJoinAndSelect("imageProfile._type", "type")
            .leftJoinAndSelect("Horse._mother", "mather")
            .leftJoinAndSelect("Horse._father", "father")
            .leftJoinAndSelect("Horse._owner", "owner")
            .where(where)
            .orderBy("Horse._" + order.field, order.order)
            .skip(skip)
            .take(limit)
            .getManyAndCount()
        return horseFound
    }

    async getYeguaGestanteWhitLastCycle(page: number, limit: number): Promise<any> {
        const skip = limit * page
        const sexFound = await this._valueList.findBySexId(1, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        const allHorses = await this._queryRunner
            .manager
            .find(Horse, {
                where: {
                    _sex: sexFound,
                    _deleted: false,
                    _status: true
                },
                relations: ["_location", "_father", "_mother", "_sex"],
            })

        const horsesWhitHistoryClassification: any = []

        for (const horse of allHorses) {
            const classification = await this._historyClassifications.findLastCycleAndStatusByHorseId(horse.id)
            if (classification.length > 0) {
                const horseJson: any = horse.toJSON()
                horseJson["lastCycle"] = classification
                horsesWhitHistoryClassification.push(horseJson)
            }
        }

        return [
            horsesWhitHistoryClassification,
            horsesWhitHistoryClassification.length
        ]
    }

    async getYeguaGestanteWhitLastCycleExport(page: number, limit: number): Promise<any> {
        const skip = limit * page
        const sexFound = await this._valueList.findBySexId(1, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        const allHorses = await this._queryRunner
            .manager
            .find(Horse, {
                where: {
                    _sex: sexFound,
                    _deleted: false,
                    _status: true
                },
                relations: ["_location", "_father", "_mother", "_sex"],
            })

        const horsesWhitHistoryClassification: Horse[] = []

        for (const horse of allHorses) {
            const classification = await this._historyClassifications.findLastCycleAndStatusByHorseId(horse.id)
            if (classification.length > 0) {
                const mother = classification.filter(m => parseInt(m.clasificationName.key) === 4)[0]?.idRelatedHorse?.name
                const motherId = classification.filter(m => parseInt(m.clasificationName.key) === 4)[0]?.idRelatedHorse?.id
                const horseJson: any = horse.toJSONExport()
                horseJson["lastCycle"] = classification[0].clasificationName.description
                const inseminationObject = classification.filter(f => parseInt(f.clasificationName.key) === 10 || parseInt(f.clasificationName.key) === 11);
                const birthday = classification[0].clasificationName.key == "6" ? classification[0]?.idRelatedHorse?.dateOfBirth : null
                let inseminationDate = inseminationObject[0]?.date ?? null;
                let estimatedBirthday = new Date(birthday);
                if (inseminationDate == null) {
                    inseminationDate = new Date(birthday);
                    inseminationDate.setDate(inseminationDate.getDate() - 336)
                }
                else {
                    estimatedBirthday = new Date(inseminationDate);
                    estimatedBirthday.setDate(estimatedBirthday.getDate() + 336)
                }
                
                horseJson["pregnantMareURL"] = `${process.env.FRONT_SERVER}/backoffice/horses/${horseJson["id"]}`
                horseJson["motherMare"] = mother ?? horseJson.name
                horseJson["motherMareid"] = motherId ?? horseJson.id
                horseJson["motherMareURL"] = `${process.env.FRONT_SERVER}/backoffice/horses/${horseJson["motherMareid"]}`
                horseJson["inseminatedWithFather"] = inseminationObject[0]?.idRelatedHorse?.name ?? horseJson.father
                horseJson["inseminatedWithFatherId"] = inseminationObject[0]?.idRelatedHorse?.id ?? horseJson.father
                horseJson["inseminatedWithFatherURL"] = `${process.env.FRONT_SERVER}/backoffice/horses/${horseJson["inseminatedWithFatherId"]}`
                horseJson["inseminationDate"] = inseminationDate ?? undefined
                horseJson["estimatedBirthday"] = birthday ?? estimatedBirthday ?? undefined
                horsesWhitHistoryClassification.push(horseJson)
            }
        }

        return [
            // @ts-ignore
            horsesWhitHistoryClassification,
            horsesWhitHistoryClassification.length
        ]
    }

    async findImagesByIdAndType(horseId: number, type: string, limit: number, page: number): Promise<string[]> {
        if (limit === undefined || limit === null)
            limit = 100
        if (page === undefined || page === null)
            page = 0
        const skip = limit * page

        let where = null
        if (type === null || type === undefined) {
            where = `Horse._id = ${horseId} `
        }
        else {
            where = `Horse._id = ${horseId} AND filesData._type._id = ${type}`
        }

        const horsesFound = await createQueryBuilder("Horse")
            .leftJoinAndSelect("Horse._filesData", "filesData")
            .leftJoinAndSelect("filesData._type", "type")
            .where(where + " AND Horse._deleted = false")
            .getOne()
        // @ts-ignore
        if (horsesFound === undefined) {
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
        }
        // @ts-ignore
        const files = horsesFound.filesData.slice(skip, limit)

        const data = files
            .filter((file: FileHorse) => !file.isDeleted())
            .map((file: FileHorse) => {
                return {
                    id: file.id,
                    url: file.url,
                    type: file.type.key.toLowerCase(),
                    description: file.description,
                    name: file.name,
                    date: file.date,
                    showInWeb: file.showInWeb
                }
            })

        return [data, files.length]
    }

    async softDelete(horseId: number) {
        const horse = await this.findById(horseId, () => {
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
        })
        // @ts-ignore
        horse.delete()
        await this._queryRunner.manager.save(horse);
    }

    async findAllLocationsByHorse(horseId: number, page: number, limit: number): Promise<[any]> {
        const skip = limit * page
        const horseFound = await this._queryRunner
            .manager
            .findOne(Horse, {
                where: { _id: horseId },
                relations: ["_locationsHistory", "_locationsHistory._location"]
            })
        const locations = horseFound.locationsHistory.slice(skip, skip + limit)

        return [{
            "total": horseFound.locationsHistory.length,
            "page": page,
            "rows": locations
        }]
    }

    async getAllLocationsHorseHistoryByHorse(horseId: number, failedClosure: () => void): Promise<any> {
        const locationHorseHistory = await this._queryRunner
            .manager
            .find(LocationHorseHistory, {
                where: { _horse: horseId },
                relations: ["_location"],
                order: {
                    _date: "DESC",
                    _id: "DESC"
                }
            })

        return locationHorseHistory
    }

    async findLastLocationByHorse(horseId: number): Promise<LocationHorseHistory> {
        return await this._queryRunner
            .manager
            .findOne(LocationHorseHistory, {
                where: { _horse: horseId },
                relations: ["_location", "_location._personCharge"],
                order: {
                    _date: "DESC",
                    _id: "DESC"
                }
            })
    }

    async exportHorses() {

        const horses = await this.getAll();

        const result = await Promise.all(horses.map(async element => {
            const horseExport = element.toJSONExport();
            const lastClassification = await this._historyClassifications.findLastClasificationByHorseId(element.id, () => { throw new Error(HistoryClassifications.ERROR_HORSE_NOT_FOUND) });
            return {
                ...horseExport,
                classification: lastClassification?.clasificationName?.value
            };
        }));

        return result;
    }

    getLocations(locationHorseHistory: any) {
        const locations: any[] = []
        locationHorseHistory.map((element: { location: any, date: any }) => {
            locations.push({ ...element.location.toJSON(), date: element.date })
        })
        return locations
    }

    async horsesLocations(search: string, filters: any, page: number, limit: number, order: any) {
        const horses = await this.filter(search, filters, page, limit, order);
        // @ts-ignore
        const result = await Promise.all(horses[0].map(async element => {
            const horseReport = element.toJSONReport();
            const locationHorseHistory = await this.getAllLocationsHorseHistoryByHorse(element.id, () => { throw new Error(HistoryClassifications.ERROR_HORSE_NOT_FOUND) });
            return {
                ...horseReport,
                locations: this.getLocations(locationHorseHistory)
            };
        }));

        return [result, horses[1]];
    }

    async exportHorsesLocations(search: string, filters: any, page: number, limit: number, order: any) {
        const horses = await this.filter(search, filters, page, limit, order);
        const resultado: any[] | PromiseLike<any[]> = []
        for (let index = 0; index < horses.length; index++) {
            const horseReport = horses[index].toJSONReport();
            const locationHorseHistorys = await this.getAllLocationsHorseHistoryByHorse(horses[index].id, () => { throw new Error(HistoryClassifications.ERROR_HORSE_NOT_FOUND) });
            locationHorseHistorys.forEach((locationHorseHistory: { date: any; location: { id: any; name: any; address: any; phoneNumber: any; }; }) => {
                resultado.push({
                    horseId: horseReport.id,
                    horseName: horseReport.name,
                    horseSex: horseReport.sex,
                    date: locationHorseHistory.date,
                    locationId: locationHorseHistory.location.id,
                    locationName: locationHorseHistory.location.name,
                    locationAddress: locationHorseHistory.location.address,
                    locationPhone: locationHorseHistory.location.phoneNumber
                })
            });

        }
        return resultado;
    }

    async getLocationHistory(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        const skip = limit * page
        let orderBy
        let defaultOrder = "DESC"
        switch (order.field) {
            case "_horse":
                orderBy = {
                    "horse._name": order.order,
                }
                break;
            case "_location":
                orderBy = {
                    "location._name": order.order,
                }
                break;
            case "_date":
                orderBy = {}
                defaultOrder = order.order
                break;
            case "_departureDate":
                orderBy = {
                    "LocationHorseHistory._departureDate": order.order,
                }
                break;
            case "_responsible":
                orderBy = {
                    "personCharge._firstName": order.order,
                    "personCharge._lastName": order.order
                }
                break;
            default:
                orderBy = { [order.field]: order.order };
                break;
        }

        this.assertHasValues(filters)

        let where = this._filterLocationsxHorse.createWhere(search, filters)
        where = where?.length > 0 ? where + " AND horse._deleted = false" : "horse._deleted = false"

        const fileFound = await createQueryBuilder("LocationHorseHistory")
            .innerJoinAndSelect("LocationHorseHistory._location", "location")
            .innerJoinAndSelect("LocationHorseHistory._horse", "horse")
            .innerJoinAndSelect("location._personCharge", "personCharge")
            .where(where)
            .skip(skip)
            .take(limit)
            // @ts-ignore
            .orderBy(orderBy)
            // @ts-ignore
            .addOrderBy("LocationHorseHistory._date", defaultOrder)
            .getManyAndCount()

        if (fileFound === undefined)
            return [[], 0]

        const list = await Promise.all(fileFound[0].map(async element => {
            return {
                // @ts-ignore
                ...element.toJSONExport()
            }
        }))
        fileFound[0] = list;
        return fileFound
    }
}