import {Veterinarian} from "./Veterinarian";
import {Peoples} from "./Peoples";
import {Human} from "./Human";
import {People} from "./People";

export class TransientPeoples extends Peoples {
    public getAllRiders(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    public findHumanByUserManagerId(humanId: number, failedClosure: () => void): Promise<any> {
        throw new Error("Method not implemented.");
    }
    private _peoples: Array<Human>;

    constructor(peoples: Array<Human>) {
        super();
        this._peoples = peoples
    }

    public async addVeterinarian(firstName: string, lastName: string, dni: string, registrationNumber: string, userManagerId: number, email: string): Promise<Veterinarian> {
        const newVeterinarian = Veterinarian.named(firstName, lastName, dni, registrationNumber, userManagerId, email)
        await this.assertDuplicatedPeople(newVeterinarian)
        await this.assertDuplicatedVeterinarian(newVeterinarian)

        this._peoples.push(newVeterinarian)
        return newVeterinarian;
    }

    public async addPeople(firstName: string, lastName: string, dni: string, userManagerId: number, email: string): Promise<People> {
        const newPeople = People.named(firstName, lastName, dni, userManagerId, email)
        await this.assertDuplicatedPeople(newPeople)

        this._peoples.push(newPeople)
        return newPeople;
    }

    public async amount(): Promise<number> {
        return this._peoples.length
    }

    public async hasVeterinarian(veterinarian: Veterinarian): Promise<boolean> {
        return Promise.resolve(this._peoples.some(people => people.isEqual(veterinarian)));
    }

    public async hasPearson(humanFind: Human): Promise<boolean> {
        return Promise.resolve(this._peoples.some(people => people.isEqual(humanFind)));
    }

    async findVeterinarianById(idVeterinarian: number, failedClosure: () => void): Promise<Veterinarian> {
        return Promise.resolve(undefined);
    }

    findPeopleById(peopleId: number, failedClosure: () => void): Promise<any> {
        return Promise.resolve(undefined);
    }

    async findHumanByList(peoples: number[], failedClosure: () => void): Promise<any> {
        return Promise.resolve(undefined);
    }
    
    getAllVeterinarian(): Promise<any> {
        return Promise.resolve(undefined);
    }

    getAllPeoples(): Promise<any> {
        return Promise.resolve(undefined);
    }

    findPeopleByDNI(dni: string, failedClosure: () => any): Promise<any> {
        return Promise.resolve(undefined);
    }

    public findVeterinarianByDNI(dni: string, failedClosure: () => void): Promise<any> {
        throw new Error("Method not implemented.");
    }

    findPeoplesByDNI(dni: string, failedClosure: () => void): Promise<any> {
        return Promise.resolve(undefined);
    }

    softDelete(peoplesID: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAllHuman(): Promise<any> {
        return Promise.resolve(undefined);
    }

    findHumanById(humanId: number, failedClosure: () => void): Promise<any> {
        return Promise.resolve(undefined);
    }
}