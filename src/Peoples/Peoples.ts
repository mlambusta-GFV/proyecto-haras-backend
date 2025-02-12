import {Veterinarian} from "./Veterinarian";
import {Human} from "./Human";
import {People} from "./People";

export abstract class Peoples {
    static readonly ERROR_CAN_NOT_ADD_DUPLICATED_VETERINARIAN = "Can not add duplicated veterinarian";
    static readonly ERROR_CAN_NOT_ADD_DUPLICATED_PEOPLES = "Can not add duplicated people";
    static readonly ERROR_CAN_NOT_FOUND_VETERINARIAN = "Can not found veterinarian"
    static readonly ERROR_CAN_NOT_FOUND_PEOPLE = "People not Found"

    public abstract addVeterinarian(firstName: string, lastName: string, dni: string, registrationNumber: string, userManagerId: number, email: string): Promise<Veterinarian>;

    public abstract addPeople(firstName: string, lastName: string, dni: string, userManagerId: number, email: string): Promise<People>;

    public abstract amount(): Promise<number>;

    protected async assertDuplicatedPeople(human: Human) {
        if (await this.hasPearson(human))
            throw new Error(Peoples.ERROR_CAN_NOT_ADD_DUPLICATED_PEOPLES)
    }

    protected async assertDuplicatedVeterinarian(veterinarian: Veterinarian) {
        if (await this.hasVeterinarian(veterinarian))
            throw new Error(Peoples.ERROR_CAN_NOT_ADD_DUPLICATED_VETERINARIAN)
    }

    public abstract hasPearson(human: Human): Promise<boolean>

    public abstract hasVeterinarian(veterinarian: Veterinarian): Promise<boolean>

    public abstract findVeterinarianById(idVeterinarian: number, failedClosure: () => void): Promise<Veterinarian | void>

    public abstract findPeopleById(peopleId: number, failedClosure: () => void): Promise<People | any>

    public abstract findHumanByList(people: number[], failedClosure: () => void): Promise<People | any>
    
    public abstract getAllVeterinarian(): Promise<any>;

    public abstract getAllPeoples(): Promise<any>;

    public abstract getAllRiders(): Promise<any>;

    public abstract findPeopleByDNI(dni: string, failedClosure: () => any): Promise<any>;

    public abstract findVeterinarianByDNI(dni: string, failedClosure: () => void): Promise<any>;

    public abstract findPeoplesByDNI(dni: string, failedClosure: () => void): Promise<any>;

    abstract softDelete(peoplesID: number): Promise<void>;

    public abstract getAllHuman(): Promise<any>;

    public abstract findHumanById(humanId: number, failedClosure: () => void): Promise<any>;

    public abstract findHumanByUserManagerId(humanId: number, failedClosure: () => void): Promise<any>
}
