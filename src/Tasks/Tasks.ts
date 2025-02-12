import { Horse } from "../Horse/Horse";
import { Human } from "../Peoples/Human";
import { TasksType } from "../ValuesList/ValueList";
import { Task } from "./Task";

export abstract class Tasks{

    static readonly ERROR_DUPLICATED_POST = "Can not add duplicated Task"
    static readonly ERROR_POST_NOT_FOUND = "Document not found"

    abstract getAll(search: string, filters: any, page: number, limit: number, order: any): Promise<unknown[]>;

    async assertDuplicatedPost(newTask: Task) {
        if (await this.hasTask(newTask))
            throw new Error(Tasks.ERROR_DUPLICATED_POST)
    }

    abstract add(title: string, typeId: number, description: string | null | undefined,  startDate: Date, endDate: Date, horseId: number, createdTaskUserId: number, relatedTaskUsersId: number[] | null | undefined): Promise<Task>;

    abstract count(): Promise<any>;

    abstract hasTask(postToCompare: Task): Promise<boolean>;

    abstract findById(id: number, failedClosure: () => void): any;

    abstract findByHorse(horseId: number, page: number, limit: number, failedClosure: () => void): any;

    abstract update(id: number, title: string,typeId: number,description: string,startDate:Date,endDate:Date,horseId:number,createdTaskUserId:number,relatedTaskUsers:number[]): any;

    abstract findByType(type: TasksType, failedClosure: () => void): unknown;

    abstract findByCreateTaskUser(user: Human, failedClosure: () => void): unknown;

    abstract delete(id: number):void;
}