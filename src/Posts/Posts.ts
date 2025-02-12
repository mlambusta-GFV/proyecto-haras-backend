import { PostType } from "../ValuesList/ValueList";
import { PostStatus } from "../ValuesList/ValueList";
import { Post } from "./Post";

export abstract class Posts{

    static readonly ERROR_DUPLICATED_POST = "Can not add duplicated Post"
    static readonly ERROR_POST_NOT_FOUND = "Document not found"

    abstract getAll(): Promise<unknown[]>;

    async assertDuplicatedPost(newPost: Post) {
        if (await this.hasPost(newPost))
            throw new Error(Posts.ERROR_DUPLICATED_POST)
    }

    abstract add(title: string, type: number, author: string, subtitle: string, content: string, postDate:Date,
                status: number, epigraph: string, slug: string, tags: string, horse: number): Promise<Post>;

    abstract count(): Promise<any>;

    abstract hasPost(postToCompare: Post): Promise<boolean>;

    abstract findById(id: number, failedClosure: () => void): any;

    abstract findByHorse(horseId: number, failedClosure: () => void): any;

    abstract update(post: Post): any;

    abstract findByStatus(status: PostStatus, failedClosure: () => void): unknown;

    abstract findByType(type: PostType, failedClosure: () => void): unknown;

    abstract delete(id: number):void;
}