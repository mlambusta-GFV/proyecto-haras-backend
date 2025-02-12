import { Location } from "./Location";
import { Locations } from "./Locations";
import { People } from "../Peoples/People";

export class TransientLocations extends Locations {
    private _locations: Map<number, Location>
    private lastId: number = 1

    constructor(locations: Map<number, Location>) {
        super();
        this._locations = locations
    }

    get locations(): Map<number, Location> {
        return this._locations;
    }

    async getAll() {
        return Array.from(this.locations.values())
    }
    async add(name: string, address: string, phoneNumber: string, personCharge: People): Promise<Location> {
        const newLocation = Location.initialize(name, address, phoneNumber, personCharge)
        await this.assertDuplicatedLocation(newLocation)
        this._locations.set(this.lastId, newLocation)
        this.lastId++
        return newLocation
    }
    async amounts() {
        return this.locations.size
    }
    async hasLocation(locationToCompare: Location) {
        const locations = Array.from(this.locations.values())
        return locations.some((location) => location.isEquals(locationToCompare));
    }
    async hasLocationNamed(locationName: string) {
        const locations = Array.from(this.locations.values())
        return locations.some((location: Location) => location.nameIs(locationName));
    }
    findById(locationId: number, failedClosure: () => void): any {
        const locationFound = this.locations.get(locationId)
        if (locationFound === undefined)
            return failedClosure()
        return locationFound
    }
    findByName(locationName: string, failedClosure: () => void) {
        const locations = Array.from(this.locations.values())
        const locationFound = locations.find((location) => location.nameIs(locationName));
        if (locationFound === undefined)
            return failedClosure()
        return locationFound
    }

    async findByPersonCharge(locationId: number, failedClosure: () => void): Promise<void | Location[]> {

    }

    async softDeleteFromLocation(locationId: number) {

    }

    async findAndUpdate(locationId: number, name: string, address: string, phoneNumber: string, personCharge: People) {

    }
}