/* eslint-disable @typescript-eslint/ban-ts-comment */
import { QueryRunner } from "typeorm";
import { Post } from "./Post";
import { Posts } from "./Posts";
import { PostStatus } from "../ValuesList/ValueList";
import { PostType } from "../ValuesList/ValueList";
import { Horses } from "../Horse/Horses";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { Filter } from "../Provider/Filter";

export class TransientPost extends Posts {
    getAll(): Promise<unknown[]> {
        throw new Error("Method not implemented.");
    }
    add(title: string, type: number, author: string, subtitle: string, content: string, postDate:Date, status: number, epigraph: string, slug: string, tags: string, horse: number): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    count(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    hasPost(postToCompare: Post): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findById(id: number, failedClosure: () => void) {
        throw new Error("Method not implemented.");
    }
    findByHorse(horseId: number, failedClosure: () => void) {
        throw new Error("Method not implemented.");
    }
    update(post: Post) {
        throw new Error("Method not implemented.");
    }
    findByStatus(status: PostStatus, failedClosure: () => void): unknown {
        throw new Error("Method not implemented.");
    }
    findByType(type: PostType, failedClosure: () => void): unknown {
        throw new Error("Method not implemented.");
    }
    delete(id: number): void {
        throw new Error("Method not implemented.");
    }
    
}