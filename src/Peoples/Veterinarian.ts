import {ChildEntity, Column, OneToMany} from "typeorm";
import {Horse} from "../Horse/Horse";
import {Human} from "./Human";

@ChildEntity()
export class Veterinarian extends Human {
    static readonly ERROR_EMPTY_REGISTRATION_NUMBER = "Registration number can not be blank";

    @Column("text")
    private _registrationNumber: string;
    @OneToMany(()=> Horse, horses => horses.veterinarian)
    private _horses: Horse[]

    static named(firstName: string, lastName: string, dni: string, registrationNumber: string, userManagerId: number, email: string) {
        this.assertFirstNameCanNotBeBlank(firstName);
        this.assertLastNameCanNotBeBlank(lastName);
        this.assertDniCanNotBeBlank(dni);
        this.assertUserManagerIdCanNotBeBlank(userManagerId);
        this.assertEmailValid(email);

        return new this(firstName, lastName, dni, registrationNumber, userManagerId,email)
    }

    constructor(firstName: string, lastName: string, dni: string, registrationNumber: string, userManagerId: number, email: string) {
        super(firstName, lastName, dni, userManagerId, email);

        this._registrationNumber = registrationNumber
    }

    get registrationNumber(): string {
        return this._registrationNumber;
    }

    get horses(): Horse[] {
        return this._horses
    }

    registrationNumberIs(registrationNumberToCompare: string){
        return this.registrationNumber === registrationNumberToCompare
    }

    toJSON()
    {
        return {
            "id": this.id,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "fullName": this.firstName+" "+this.lastName,
            "dni": this.dni,
            "email": this.email,
            "registrationNumber": this.registrationNumber
        }
    }
}