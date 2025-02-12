import {Veterinarian} from "./Veterinarian";
import {createQueryBuilder, QueryRunner} from "typeorm";
import {Peoples} from "./Peoples";
import {People} from "./People";
import {Human} from "./Human";
import {Horses} from "../Horse/Horses";

export class PersistentPeoples extends Peoples {
    private _queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        super();
        this._queryRunner = queryRunner;
    }

    public async addVeterinarian(firstName: string, lastName: string, dni: string, registrationNumber: string, userManagerId: number, email: string): Promise<Veterinarian> {
        const newVeterinarian = Veterinarian.named(firstName, lastName, dni, registrationNumber, userManagerId, email)
        await this.assertDuplicatedPeople(newVeterinarian)

        return await this._queryRunner.manager.save(newVeterinarian)
    }

    public async addPeople(firstName: string, lastName: string, dni: string, userManagerId: number, email: string): Promise<People> {
        const newPeople = People.named(firstName, lastName, dni, userManagerId, email)
        await this.assertDuplicatedPeople(newPeople)

        return await this._queryRunner.manager.save(newPeople)
    }

    public async amount(): Promise<number> {
        return await this._queryRunner.manager.count(Veterinarian);
    }

    public async hasVeterinarian(veterinarian: Veterinarian): Promise<boolean> {
        const veterinarianFound = await this._queryRunner
            .manager
            .findOne(Veterinarian,{where: {_registrationNumber: veterinarian.registrationNumber}})
        if(veterinarianFound === undefined)
            return false
        return true
    }

    public async hasPearson(human: Human): Promise<boolean> {
        const humanFound = await this._queryRunner
            .manager
            .findOne(Human,{where: {_dni: human.dni}})
        if(humanFound === undefined)
            return false
        return true
    }

    public async findVeterinarianById(idVeterinarian: number, failedClosure: () => void): Promise<Veterinarian | void> {
        const veterinarianFound = await this._queryRunner
            .manager
            .findOne(Veterinarian,{where: {_id: idVeterinarian}})
        if(veterinarianFound === undefined)
            return failedClosure()
        return veterinarianFound
    }

    public async findVeterinarianByDNI(dni: string, failedClosure: () => void): Promise<any> {
        const veterinarianFound = await this._queryRunner
            .manager
            .findOne(Veterinarian, {where: {_dni: dni}})
        if (veterinarianFound === undefined)
            return failedClosure()
        return veterinarianFound
    }

    public async findPeoplesByDNI(dni: string, failedClosure: () => void): Promise<any> {
        const peopleFound = await this._queryRunner
            .manager
            .findOne(People, {where: {_dni: dni}})
        if (peopleFound === undefined)
            return failedClosure()
        return peopleFound
    }

    public async findPeopleById(peopleId: number, failedClosure: () => void): Promise<any> {
        const peopleFound = await this._queryRunner
            .manager
            .findOne(People,{where: {_id: peopleId}})
        if(peopleFound === undefined)
            return failedClosure()
        return peopleFound
    }

    public async findHumanById(humanId: number, failedClosure: () => void): Promise<any> {
        const peopleFound = await this._queryRunner
            .manager
            .findOne(Human, {where: {_id: humanId}})
        if (peopleFound === undefined)
            return failedClosure()
        return peopleFound
    }

    public async findHumanByUserManagerId(humanId: number, failedClosure: () => void): Promise<any> {
        const peopleFound = await this._queryRunner
            .manager
            .findOne(Human, {where: {_userManagerId: humanId}})
        if (peopleFound === undefined)
            return failedClosure()
        return peopleFound
    }

    public async findHumanByList(peoples: number[], failedClosure: () => void): Promise<any> {
        const peopleFound = await createQueryBuilder("Human")
            .where("_id  IN(:...ids) ", {ids: peoples})
            .getMany();
        if(peopleFound === undefined)
            return failedClosure()
        return peopleFound
    }

    public async findPeopleByDNI(dni: string, failedClosure: () => any): Promise<any> {
        const peopleFound = await this._queryRunner
            .manager
            .findOne(People, {where: {_dni: dni}})
        if (peopleFound === undefined)
            return failedClosure()
        return peopleFound
    }

    public async getAllVeterinarian() {
        const columnOrder: any = {};
        columnOrder._firstName = "ASC";
        columnOrder._lastName = "ASC";
        const veterinarian = await this._queryRunner
            .manager
            .find(Veterinarian,{order:columnOrder})
            
        return veterinarian
    }

    public async getAllHuman() {
        const columnOrder: any = {};
        columnOrder._firstName = "ASC";
        columnOrder._lastName = "ASC";
        const humans = await this._queryRunner
            .manager
            .find(Human,{where:{"_deleted":false}, order:columnOrder})
        return humans
    }

    public async getAllPeoples() {
        const columnOrder: any = {};
        columnOrder._firstName = "ASC";
        columnOrder._lastName = "ASC";
        const peoples = await this._queryRunner
            .manager
            .find(People,{where:{"_deleted":false}, order:columnOrder})
        return peoples
    }

    public async getAllRiders() {
        const riders = await this._queryRunner.query(`select h._id as "id",
        concat( h._firstName , " " , h._lastName) as "name"
        from human h
        inner join Users u on h._userManagerId=u.id
        inner join Roles r on u.role = r.id	
        where r.name IN ('rider','administrator')
        and h._deleted = 0;`);

        return riders
    }

    async softDelete(humanID: number) {
        const human = await this.findHumanByUserManagerId(humanID, () => {
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
        })
        // @ts-ignore
        human.delete()
        await this._queryRunner.manager.save(human);
    }


}