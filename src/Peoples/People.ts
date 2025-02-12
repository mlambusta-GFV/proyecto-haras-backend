import {Human} from "./Human";
import {ChildEntity, OneToMany} from "typeorm";
import {Location} from "../Locations/Location";
import {Horse} from "../Horse/Horse";

@ChildEntity()
export class People extends Human {

    @OneToMany(()=> Location, location => location.personCharge)
    private _locations: Location[];
    @OneToMany(()=> Horse, horse => horse.rider)
    private _riders: Horse[]
    @OneToMany(()=> Horse, horse => horse.owner)
    private _owner: Horse[]

    static named(firstName: string, lastName: string, dni: string, userManagerId: number, email: string) {
        this.assertFirstNameCanNotBeBlank(firstName);
        this.assertLastNameCanNotBeBlank(lastName);
        this.assertDniCanNotBeBlank(dni);
        this.assertUserManagerIdCanNotBeBlank(userManagerId);
        this.assertEmailValid(email);

        return new this(firstName, lastName, dni, userManagerId, email);
    }

    get locations(): Location[] {
        return this._locations;
    }

    get riders(): Horse[] {
        return this._riders
    }

    get owner(): Horse[] {
        return this._owner
    }

    toJSON(){
        return {
            "id": this.id,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "fullName": this.firstName+" "+this.lastName,
            "email": this.email,
            "dni": this.dni
        }
    }
}