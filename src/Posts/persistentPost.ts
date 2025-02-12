/* eslint-disable @typescript-eslint/ban-ts-comment */
import { QueryRunner } from "typeorm";
import { Post } from "./Post";
import { Posts } from "./Posts";
import { PostStatus } from "../ValuesList/ValueList";
import { PostType } from "../ValuesList/ValueList";
import { Horses } from "../Horse/Horses";
import { ValuesLists } from "../ValuesList/ValuesLists";
import { Filter } from "../Provider/Filter";

export class PersistentPost extends Posts{

    private _queryRunner: QueryRunner;
    private _horses: Horses;
    private _valueList: ValuesLists
    private _filter: Filter

    static ERROR_INVALID_FILTER_TYPE = "This filter is invalid"
    static ERROR_INVALID_FILTER_CONDITION = "This condition is invalid"
    static ERROR_INVALID_FILTER_NAME  = "This name is invalid";
    
    constructor(queryRunner: QueryRunner, horse: Horses, valueList: ValuesLists) {
        super()
        this._queryRunner = queryRunner;
        this._horses = horse;
        this._valueList = valueList;
        this._filter = Filter.initialize("Post", ["title", "type", "author", "slug", "tags", "status"], ["equal", "like"], ["string", "boolean", "object"],["title"]);
    }
    async getAll(): Promise<unknown[]> {
        return await this._queryRunner.manager
        .find(Post, {where: {_deleted: false },
            relations: ["_type", "_status", "_horse"]})
    }

    async add(title: string, typeId: number, author: string, subtitle: string, content: string, postDate: Date,
        statusId: number, epigraph: string, slug: string, tags: string, horseId: number): Promise<Post> {
        
        const horse = await this._horses.findById(horseId, ()=> {throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)})
        
        const postType = await this._valueList.findByPostTypeId(typeId, ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        const postStatys = await this._valueList.findByPostStatusId(statusId, ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)})

        // @ts-ignore
        const newPost = Post.initialize(title, postType.id, author, subtitle, content, postDate, postStatys.id, epigraph, slug, tags, horse.id) 
        
        await this.assertDuplicatedPost(newPost)

        await this._queryRunner.manager.save(newPost);

        return newPost
    }
    
    async count(): Promise<any> {
        return await this._queryRunner.manager.count(Post);
    }

    async hasPost(postToCompare: Post): Promise<boolean> {

        const postListFound = await this._queryRunner
        .manager
        .count(Post, {where: {  _slug : postToCompare.slug}})
        return postListFound > 0;
    }

    async findById(id: number, failedClosure: () => void) {
        const postFound = await this._queryRunner
            .manager
            .findOne(Post, {where: {_id: id, _deleted: false}, relations: ["_type", "_status", "_horse"]})
        if(postFound === undefined)
            return failedClosure()
        return  postFound
    }

    async findByHorse(horseId: number, failedClosure: () => void) {
        const postFound = await this._queryRunner
            .manager
            .find(Post, {where: {_horse: horseId, _deleted: false}, relations: ["_type", "_status", "_horse"]})
        if(postFound === undefined)
            return failedClosure()
        return  postFound
    }

    async update(post: Post) {
        const oldPost = await this._queryRunner.manager
            .findOne(Post, {where: {_id: post.id}})        
        const horse = await this._horses.findById(post.horse.id, ()=> {throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)})
        
        const postType = await this._valueList.findByPostTypeId(post.type.id, ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        const postStatys = await this._valueList.findByPostStatusId(post.status.id, ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        // @ts-ignore
        const newPost = Post.initialize(post.title, postType, post.author, post.subtitle, post.content, post.postDate, postStatys, post.epigraph, post.slug, post.tags, horse) 
        
        oldPost.sync(newPost)
        await this._queryRunner.manager.save(oldPost);
        return oldPost
    }

    async findByStatus(status: PostStatus, failedClosure: () => void): Promise<unknown> {
        const postFound = await this._queryRunner
            .manager
            .find(Post, {where: {_status: status, _deleted: false}, relations: ["_type", "_status", "_horse"]})
        if(postFound === undefined)
            return failedClosure()
        return  postFound
    }

    async findByType(type: PostType, failedClosure: () => void): Promise<unknown> {
        const postFound = await this._queryRunner
            .manager
            .find(Post, {where: {_type: type, _deleted: false}, relations: ["_type", "_status", "_horse"]})
        if(postFound === undefined)
            return failedClosure()
        return  postFound
    }

    async delete(id: number): Promise<void> {
        const postFound = await this.findById(id, () => {
            throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE)
        })
        // @ts-ignore
        postFound.delete()
        await this._queryRunner.manager.save(postFound);
    }

    private assertHasValues(filters: [{ name: string, values: [], condition: string, type: string }]): void
    {
        const isValidCondition = filters.every(filter => {
            if(filter.values !== undefined)
                return filter.values.length > 0
            return true
        })
        if (!isValidCondition) {
            throw new Error(PersistentPost.ERROR_INVALID_FILTER_CONDITION)
        }
    }

    async filter(search: string, filters: any, page: number, limit: number, order: any): Promise<Post[]> {
        const skip = limit * page
        if(order === undefined || order === null){
            order = {
                field: "id",
                order: "DESC"
            }
        }

        this.assertHasValues(filters)

        const where = this._filter.createWhere(search, filters)
        // @ts-ignore
        const postFound: Post[] = await createQueryBuilder("Post")
            .leftJoinAndSelect("Post._title", "title")
            .leftJoinAndSelect("location._author", "author")
            .leftJoinAndSelect("Post._slug", "slug")
            .leftJoinAndSelect("Post._tags", "tags")
            .leftJoinAndSelect("Post._status","status")
            .leftJoinAndSelect("Post._type","Type")
            .where(where)
            .orderBy("Post._"+order.field, order.order)
            .skip(skip)
            .take(limit)
            .getManyAndCount()
        return postFound
    }
    
}
