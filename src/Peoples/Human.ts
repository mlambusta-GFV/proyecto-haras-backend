import { Task } from "../Tasks/Task";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn
} from "typeorm";
import {FileEducation} from "../MediaCenters/FileEducation";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export abstract class Human {
    static readonly ERROR_FIRST_NAME_CAN_NOT_BE_EMPTY = "First name can not be empty";
    static readonly ERROR_LAST_NAME_CAN_NOT_BE_EMPTY = "Last name can not be empty";
    static readonly ERROR_DNI_CAN_NOT_BE_EMPTY = "DNI can not be empty";
    static readonly ERROR_INVALID_EMAIL= "Invalid email"
    static readonly ERROR_USER_MANAGER_ID_CAN_NOT_BE_EMPTY = "UserManagerId can not be empty";

    @PrimaryGeneratedColumn()
    private _id: number
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({ type: "boolean", default: false })
    private _deleted: boolean;
    @Column("bigint")
    private _userManagerId: number
    @Column("text")
    protected _firstName: string;
    @Column("text")
    protected _lastName: string;
    @Column("text")
    protected _dni: string;
    @Column("text")
    protected _email: string;
    @OneToMany(()=> Task, task => task.createdTaskUser)
    private _tasks: Task[]

    static assertFirstNameCanNotBeBlank(name: string) {
        if (name.trim().length === 0) throw new Error(this.ERROR_FIRST_NAME_CAN_NOT_BE_EMPTY)
    }

    static assertEmailValid(email: string) {
        const re=/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        if (!re.test(email)) throw new Error(this.ERROR_INVALID_EMAIL)
    }
    
    static assertLastNameCanNotBeBlank(name: string) {
        if (name.trim().length === 0) throw new Error(this.ERROR_LAST_NAME_CAN_NOT_BE_EMPTY)
    }

    static assertDniCanNotBeBlank(name: string) {
        if (name.trim().length === 0) throw new Error(this.ERROR_DNI_CAN_NOT_BE_EMPTY)
    }

    static assertUserManagerIdCanNotBeBlank(userManagerId: number) {
        if (userManagerId == null || userManagerId == undefined || userManagerId < 0) throw new Error(this.ERROR_USER_MANAGER_ID_CAN_NOT_BE_EMPTY)
    }

    get id(): number {
        return this._id
    }

    get userManagerId(): number {
        return this._userManagerId
    }

    get email(): string {
        return this._email
    }

    get tasks(): Task[]
    {
        return this._tasks
    }
    
    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName
    }

    get dni(): string {
        return this._dni
    }

    firstNameIs(firstName: string): boolean {
        return this.firstName === firstName
    }

    lastNameIs(lastName: string): boolean {
        return this.lastName === lastName
    }

    dniIs(dni: string): boolean {
        return this.dni === dni
    }

    nameIs(firstName: string, lastName: string): boolean {
        return this.firstNameIs(firstName) && this.lastNameIs(lastName)
    }

    isEqual(human: Human): boolean {
        return this.dniIs(human.dni);
    }

    constructor(firstName: string, lastName: string, dni: string, userManagerId: number, email: string) {
        this._userManagerId = userManagerId;
        this._firstName = firstName;
        this._lastName = lastName;
        this._dni = dni;
        this._email = email;
    }

    public delete(){
        this._deleted = true
    }

    toJSON()
    {
        return {
            "id": this.id,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "fullName": this.firstName+" "+this.lastName,
            "email": this.email,
            "dni":this.dni
        }
    }
}