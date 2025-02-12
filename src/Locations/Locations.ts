import { Location } from "./Location";
import { People } from "../Peoples/People";

export abstract class Locations {
    static readonly ERROR_DUPLICATED_LOCATION = 'Can not add duplicated location'
    static readonly ERROR_LOCATION_NOT_FOUND = 'Location can not be found'

    abstract getAll(): Promise<unknown[]>;

    async assertDuplicatedLocation(newLocation: Location) {
        if (await this.hasLocation(newLocation))
            throw new Error(Locations.ERROR_DUPLICATED_LOCATION)
    }

    abstract add(name: string, address: string, phoneNumber: string, personCharge: People): Promise<Location>;

    abstract amounts(): Promise<any>;

    abstract hasLocation(locationToCompare: Location): Promise<boolean>;

    abstract hasLocationNamed(locationName: string): Promise<boolean>;

    abstract findById(locationId: number, failedClosure: () => void): any;

    abstract findByName(locationName: String, failedClosure: () => void): unknown;

    abstract findByPersonCharge(peopleChargeId: number, failedClosure: () => void): any;

    abstract findAndUpdate(locationId: number, name: string, address: string, phoneNumber: string, personCharge: People): any;

    abstract softDeleteFromLocation(locationId: number): void;
}