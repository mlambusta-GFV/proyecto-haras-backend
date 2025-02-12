import { createQueryBuilder, getManager, QueryRunner } from "typeorm";
import { Location } from "./Location";
import { Locations } from "./Locations";
import { People } from "../Peoples/People";

export class PersistentLocations extends Locations {
    private queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        super()
        this.queryRunner = queryRunner
    }

    async hasLocation(locationToCompare: Location) {
        return this.hasLocationNamed(locationToCompare.name)
    }

    async add(name: string, address: string, phoneNumber: string, personCharge: People): Promise<Location> {
        const newLocation = Location.initialize(name, address, phoneNumber, personCharge)
        await this.assertDuplicatedLocation(newLocation)

        await this.queryRunner.manager.save(newLocation);
        return newLocation;
    }

    async amounts() {
        return await this.queryRunner.manager.count(Location);
    }

    async hasLocationNamed(locationName: string): Promise<boolean> {
        const locationFound = await this.queryRunner.query(`SELECT 1 FROM location WHERE _name = '${locationName}'`)
        return locationFound.length > 0;
    }

    async findById(locationId: number, failedClosure: () => void): Promise<Location | void> {
        const locationFound = await this.queryRunner.manager.findOne(Location, {
            where: { _id: locationId, _deleted: false },
            relations: ["_personCharge"]
        })
        if (locationFound === undefined)
            return failedClosure()
        return locationFound
    }

    async findByName(locationName: string, failedClosure: () => void) {
        const locationFound = await this.queryRunner
            .manager
            .findOne(Location, { where: { _name: locationName, _deleted: false }, relations: ["_personCharge"] });
        if (locationFound === undefined)
            return failedClosure()
        return locationFound
    }

    async getAll() {
        return await this.queryRunner.manager.find(Location, {
            where: { _deleted: false },
            relations: ["_personCharge"]
        });
    }

    async findByPersonCharge(peopleChargeId: number, failedClosure: () => void): Promise<void | Location[]> {
        const locationFound = await this.queryRunner.manager.find(Location, {
            where: { _personCharge: peopleChargeId, _deleted: false },
        });
        if (locationFound === undefined)
            return failedClosure()
        return locationFound
    }

    async softDeleteFromLocation(locationId: number) {
        await createQueryBuilder()
            .update("location")
            .set({ _deleted: true })
            .where("_id = :id", { id: locationId })
            .execute();
    }

    async findAndUpdate(locationId: number, name: string, address: string, phoneNumber: string, personCharge: People) {

        const location = await this.findById(locationId, () => { throw new Error(Locations.ERROR_LOCATION_NOT_FOUND) })
        //@ts-ignore
        location.setName(name)
        //@ts-ignore
        location.setAdress(address)
        //@ts-ignore
        location.setPhoneNumber(phoneNumber)
        //@ts-ignore
        location.setPersonCharge(personCharge)

        const entityManager = getManager();
        await entityManager.save(location);

        return location
    }

}