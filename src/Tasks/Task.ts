import { Human } from "../Peoples/Human";
import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Horse} from "../Horse/Horse";
import {TasksType} from "../ValuesList/ValueList";

@Entity()
export class Task{
    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _title: string
    @ManyToOne(()=> TasksType)
    private _type: TasksType
    @Column("text")
    private _description: string
    @Column("datetime")
    private _startDate: Date
    @Column("datetime")
    private _endDate : Date
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({type: "boolean", default: false})
    private _deleted: boolean
    @ManyToOne(()=> Horse, horse => horse.tasks)
    private _horse: Horse
    @ManyToOne(()=> Human, human => human.tasks)
    private _createdTaskUser: Human
    @ManyToMany(() => Human)
    @JoinTable()
    private _relatedTaskUsers: Human[]

    static readonly ERROR_NAME_BLANK = "Title can not be empty"
    static readonly ERROR_INVALID_TYPE = "Type can not be empty"
    static readonly ERROR_INVALID_DATES = "start and end date can not be empty"
    static readonly ERROR_INVALID_CREATED_USER = "Create Task User can not be empty"

    static assertNotEmptyTitle(title: string) {
        if (title === null || title === undefined || title.trim().length === 0)
            throw new Error(this.ERROR_NAME_BLANK)
    }

    static assertNotEmptyType(tipe: TasksType) {
        if (tipe === null || tipe === undefined)
            throw new Error(this.ERROR_INVALID_TYPE)
    }

    static assertNotEmptycreatedTaskUser(createdTaskUser: Human) {
        if (createdTaskUser === null || createdTaskUser === undefined)
            throw new Error(this.ERROR_INVALID_CREATED_USER)
    }

    static assertNotEmptyDates(startDate: Date, endDate: Date) {
        if (startDate === null || startDate === undefined || endDate === null || endDate === undefined)
            throw new Error(this.ERROR_INVALID_CREATED_USER)
    }

    private constructor(title: string, type: TasksType, description: string | null | undefined, startDate: Date, endDate: Date,  horse: Horse, createdTaskUser: Human, relatedTaskUsers: Human[])
    {
        this._title = title;
        this._type = type;
        this._description = description;
        this._startDate = startDate;
        this._endDate = endDate;
        this._horse = horse;
        this._createdTaskUser = createdTaskUser;
        this._relatedTaskUsers = relatedTaskUsers;
    }

    static initialize(title: string, type: TasksType, description: string | null | undefined, startDate: Date, endDate: Date,  horse: Horse, createdTaskUser: Human, relatedTaskUsers: Human[]): Task
    {
        this.assertNotEmptyTitle(title);
        this.assertNotEmptyType(type);
        this.assertNotEmptycreatedTaskUser(createdTaskUser);
        this.assertNotEmptyDates(startDate, endDate);
        return new this(title, type, description, startDate, endDate,  horse, createdTaskUser, relatedTaskUsers)
    }

    get id(): number {
        return this._id
    }
    
    get title(): string {
        return this._title;
    }

    get startDate():Date{
        return this._startDate
    }

    get endDate():Date{
        return this._endDate
    }

    get description(): string {
        return this._description;
    }

    get type(): TasksType {
        return this._type;
    }

    get createdDate(): Date {
        return this._createdDate;
    }

    get updatedDate(): Date {
        return this._updatedDate;
    }

    get deleted(): boolean
    {
        return this._deleted
    }

    get horse(): Horse
    {
        return this._horse
    }

    get createdTaskUser(): Human
    {
        return this._createdTaskUser
    }

    get relatedTaskUsers(): Human[]
    {
        return this._relatedTaskUsers
    }

    isName(title: string): boolean
    {
        return this.title === title
    }

    isType(type: TasksType):boolean
    {
        return this.type === type
    }

    isCreatedDate(date: Date):boolean
    {
        return this.createdDate.getTime() === date.getTime()
    }

    isUpdatedDate(date: Date):boolean
    {
        return this.updatedDate.getTime() === date.getTime()
    }

    isHorse(horse: Horse):boolean
    {
        return this.horse.isEqual(horse)
    }

    isCreatedTaskUser(createdTaskUser:Human){
        return this.createdTaskUser.isEqual(createdTaskUser)
    }

    isStartDate(date: Date){
        return this.startDate.getTime() === date.getTime()
    }

    isEndDate(date: Date){
        return this.endDate.getTime() === date.getTime()
    }

    isdeleted(){
        this._deleted = true
    }

    sync(newTask: Task): void
    {
        this._title = newTask.title;
        this._type = newTask.type;
        this._description = newTask.description;
        this._startDate = newTask.startDate;
        this._endDate = newTask.endDate;
        this._horse = newTask.horse;
        this._createdTaskUser = newTask.createdTaskUser;
        this._relatedTaskUsers = newTask.relatedTaskUsers;


    }

    toJSON()
    {
        return {
            "id": this.id,
            "title": this.title,
            "type": this.type,
            "description": this.description,
            "delete": this.deleted,
            "horse": this.horse,
            "human": this._createdTaskUser,
            "relatedTaskUsers": this.relatedTaskUsers,
            "startDate": this.startDate,
            "endDate": this.endDate
        }
    }
}