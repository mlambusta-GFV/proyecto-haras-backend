/* eslint-disable @typescript-eslint/ban-ts-comment */
import { QueryRunner } from "typeorm";
import { TasksType} from "../ValuesList/ValueList";
import { Horses } from "../Horse/Horses";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { Filter } from "../Provider/Filter";
import { Tasks } from "./Tasks";
import { Task } from "./Task";
import { Human } from "../Peoples/Human";

export class TransientTasks extends Tasks {
    getAll(search: string, filters: any, page: number, limit: number, order: any): Promise<unknown[]> {
        throw new Error("Method not implemented.");
    }
    add(title: string, typeId: number, description: string, startDate: Date, endDate: Date, horseId: number, createdTaskUserId: number, relatedTaskUsersId: number[]): Promise<Task> {
        throw new Error("Method not implemented.");
    }
    findByCreateTaskUser(user: Human, failedClosure: () => void): unknown {
        throw new Error("Method not implemented.");
    }
    count(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    hasTask(postToCompare: Task): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findById(id: number, failedClosure: () => void) {
        throw new Error("Method not implemented.");
    }

    findByHorse(horseId: number, page: number, limit: number, failedClosure: () => void): any {
        throw new Error("Method not implemented.");
    }
    update(id: number, title: string,typeId: number,description: string,startDate:Date,endDate:Date,horseId:number,createdTaskUserId:number,relatedTaskUsers:number[]) {
        throw new Error("Method not implemented.");
    }
    findByType(type: TasksType, failedClosure: () => void): unknown {
        throw new Error("Method not implemented.");
    }
    delete(id: number): void {
        throw new Error("Method not implemented.");
    }
}