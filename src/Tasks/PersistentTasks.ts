/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createQueryBuilder, QueryRunner } from "typeorm";
import { Task } from "./Task";
import { Tasks } from "./Tasks";
import { TasksType } from "../ValuesList/ValueList";
import { Horses } from "../Horse/Horses";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { Filter } from "../Provider/Filter";
import { Human } from "../Peoples/Human";
import { Peoples } from "../Peoples/Peoples";

export class PersistentTasks extends Tasks{
   
    
    private _queryRunner: QueryRunner;    
    private _horses: Horses;
    private _valueList: ValuesLists;
    private _human: Peoples;
    private _filter: Filter;
    
    static ERROR_INVALID_FILTER_TYPE = "This filter is invalid"
    static ERROR_INVALID_FILTER_CONDITION = "This condition is invalid"
    static ERROR_INVALID_FILTER_NAME  = "This title is invalid";

    constructor(queryRunner: QueryRunner, horse: Horses, valueList: ValuesLists, human: Peoples) {
        super()
        this._queryRunner = queryRunner;
        this._horses = horse;
        this._valueList = valueList;
        this._human = human
        this._filter = Filter.initialize("Task", ["title", "type","Horse", "createdTaskUser","deleted"], ["equal", "like"], ["string", "boolean", "object"],["title"]);
    }

    async getAll(search: string, filters: any, page: number, limit: number, order: any): Promise<unknown[]> {
            const skip = limit * page;
        this.assertHasValues(filters)
        const where = this._filter.createWhere(search, filters)
        // @ts-ignore
        const TasksFound: Task[] = await createQueryBuilder("Task")
            .leftJoinAndSelect("Task._horse", "Horse")
            .leftJoinAndSelect("Task._type","TasksType")
            .leftJoinAndSelect("Task._createdTaskUser","Human")
            .leftJoinAndSelect("Task._relatedTaskUsers","RelatedUsers")
            .where(where)
            .orderBy("Task._" + order.field, order.order)
            .skip(skip)
            .take(limit)
            .getManyAndCount()
        return TasksFound
    }

    async add(title: string, typeId: number, description: string | null | undefined, startDate: Date, endDate: Date, horseId: number, createdTaskUserId: number, relatedTaskUsers: number[] | null | undefined): Promise<Task> {
        const horse = await this._horses.findById(horseId, ()=> {throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)})
        const createUser:number[]=[createdTaskUserId];
        const createdTaskUser = await this._human.findHumanByList(createUser, ()=>{throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)})
        let relatedUsers=null;
        if (relatedTaskUsers !== undefined && relatedTaskUsers !== null && relatedTaskUsers.length >0){
            // @ts-ignore
            const relatedTask = JSON.parse(relatedTaskUsers)
            relatedUsers = await this._human.findHumanByList(relatedTask, ()=>{throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)})
        }
        const tasksType = await this._valueList.findByTasksTypeId(typeId, ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        // @ts-ignore
        const newTask = Task.initialize(title, tasksType, description, startDate, endDate, horse, createdTaskUser[0], relatedUsers)
        
        await this._queryRunner.manager.save(newTask);

        return newTask
    }

    async count(): Promise<any> {
        return await this._queryRunner.manager.count(Task);
    }

    async hasTask(taskToCompare: Task): Promise<boolean> {
        const taskListFound = await this._queryRunner
        .manager
        .count(Task, {where: {  _title : taskToCompare.title}})
        return taskListFound > 0;
    }

    async findById(id: number, failedClosure: () => void) {
        const taskFound = await this._queryRunner
            .manager
            .findOne(Task, {where: {_id: id, _deleted: false}, relations: ["_type", "_horse", "_createdTaskUser", "_relatedTaskUsers"]})
        if(taskFound === undefined)
            return failedClosure()
        return  taskFound
    }

    async findByHorse(horseId: number, page: number, limit: number, failedClosure: () => void): Promise<any> {
        const skip = limit * page;
        const taskFound = await this._queryRunner
            .manager
            .findAndCount(Task, {
                where: {_horse: horseId, _deleted: false},
                relations: ["_type", "_horse", "_createdTaskUser", "_relatedTaskUsers"],
                skip: skip,
                take: limit
            })
        if(taskFound === undefined)
            return failedClosure()
        return  taskFound
    }

    async update(id: number, title: string,typeId: number,description: string,startDate:Date,endDate:Date,horseId:number,createdTaskUserId:number,relatedTaskUsers:number[]) {

        const oldTask = await this.findById(id, ()=> {throw new Error(Tasks.ERROR_POST_NOT_FOUND)});
        const horse = await this._horses.findById(horseId, ()=> {throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)});
        const createUser:number[]=[createdTaskUserId];
        const createdTaskUser = await this._human.findHumanByList(createUser, ()=>{throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)});
        let relatedUsers=null;
        if (relatedTaskUsers !== undefined && relatedTaskUsers !== null && relatedTaskUsers.length >0){
            // @ts-ignore
            const relatedTask = JSON.parse(task.relatedTaskUsers)
            relatedUsers = await this._human.findHumanByList(relatedTask, ()=>{throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)})
        }
        const taskType = await this._valueList.findByTasksTypeId(typeId, ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)});
        // @ts-ignore
        const newTask = Task.initialize(title, taskType, description, startDate, endDate, horse, createdTaskUser, relatedUsers);
        
        // @ts-ignore
        oldTask.sync(newTask)
        await this._queryRunner.manager.save(oldTask);
        return oldTask
    }

    async findByCreateTaskUser(user: Human, failedClosure: () => void): Promise<unknown> {
        const taskFound = await this._queryRunner
            .manager
            .find(Task, {where: {_createdTaskUser: user, _deleted: false}, relations: ["_type", "_horse", "_createdTaskUser", "_relatedTaskUsers"]})
        if(taskFound === undefined)
            return failedClosure()
        return  taskFound
    }

    async findByType(type: TasksType, failedClosure: () => void): Promise<unknown> {
        const taskFound = await this._queryRunner
            .manager
            .find(Task, {where: {_type: type, _deleted: false}, relations: ["_type", "_horse", "_createdTaskUser", "_relatedTaskUsers"]})
        if(taskFound === undefined)
            return failedClosure()
        return  taskFound
    }

    async delete(id: number): Promise<void> {
        const taskFound = await this.findById(id, () => {
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
        })
        // @ts-ignore
        taskFound.isdeleted()
        await this._queryRunner.manager.save(taskFound);
    }

    private assertHasValues(filters: [{ name: string, values: [], condition: string, type: string }]): void
    {
        const isValidCondition = filters.every(filter => {
            if(filter.values !== undefined)
                return filter.values.length > 0
            return true
        })
        if (!isValidCondition) {
            throw new Error(PersistentTasks.ERROR_INVALID_FILTER_CONDITION)
        }
    }
}