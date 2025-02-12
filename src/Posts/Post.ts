import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Horse} from "../Horse/Horse";
import {PostType, PostStatus} from "../ValuesList/ValueList";

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _title: string
    @ManyToOne(()=> PostType)
    private _type: PostType
    @Column("text")
    private _author: string
    @Column("text")
    private _subtitle: string
    @Column("text")
    private _content: string
    @Column("text")
    private _epigraph: string
    @Column("text")
    private _slug: string
    @ManyToOne(()=> PostStatus)
    private _status: PostStatus
    @Column("text")
    private _tags: string;
    @Column("datetime")
    private _postDate: Date;
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({type: "boolean", default: false})
    private _deleted: boolean
    @ManyToOne(()=> Horse, horse => horse.posts)
    private _horse: Horse


    static readonly ERROR_TITLE_BLANK = "Title can not be empty"
    static readonly ERROR_INVALID_TYPE = "Type can not be empty"
    static readonly ERROR_INVALID_DATE = "Date can not be empty and must be greater than today"
    static readonly ERROR_INVALID_SLUG = "Slug can not be empty"

    static assertNotEmptyTitle(title: string) {
        if (title === null || title === undefined || title.trim().length === 0)
            throw new Error(this.ERROR_TITLE_BLANK)
    }

    static assertNotEmptyType(PostTypeFind: PostType) {
        if (PostTypeFind === null || PostTypeFind === undefined )
            throw new Error(this.ERROR_INVALID_TYPE)
    }

    static assertNotEmptyPostDate(postDate: Date) {

        if (postDate === null || postDate === undefined || postDate <= new Date())
            throw new Error(this.ERROR_INVALID_TYPE)
    }

    static assertNotEmptySlug(slug: string) {

        if (slug === null || slug === undefined )
            throw new Error(this.ERROR_INVALID_SLUG)
    }

    static initialize(title: string, type: PostType, author: string | null | undefined, subtitle: string | null | undefined, content: string, postDate: Date,
        status: PostStatus, epigraph: string | null | undefined, slug: string, tags: string | null | undefined, horse: Horse): Post
    {
        this.assertNotEmptyTitle(title)
        this.assertNotEmptyType(type)
        this.assertNotEmptyPostDate(postDate)
        this.assertNotEmptySlug(slug)
        return new this(title, type, author, subtitle, content, postDate, status, epigraph, slug, tags, horse)
    }

    private constructor(title: string, type: PostType , author: string, subtitle: string, content: string, postDate: Date,
        status: PostStatus, epigraph: string, slug: string, tags: string, horse: Horse)
    {
        this._title = title;
        this._type = type;
        this._author = author;
        this._subtitle = subtitle;
        this._content = content;
        this._postDate = postDate;
        this._status = status;
        this._epigraph = epigraph;
        this._slug = slug;
        this._tags = tags;
        this._horse = horse;
    }

    get id(): number {
        return this._id
    }

    get title(): string {
        return this._title;
    }

    get type(): PostType {
        return this._type;
    }

    get author(): string {
        return this._author;
    }

    get subtitle(): string {
        return this._subtitle;
    }

    get content(): string {
        return this._content;
    }

    get createdDate(): Date {
        return this._createdDate;
    }

    get updatedDate(): Date {
        return this._updatedDate;
    }

    get epigraph(): string {
        return this._epigraph;
    }

    get slug(): string {
        return this._slug;
    }

    get status(): PostStatus
    {
        return this._status;
    }

    get tags(): string
    {
        return this._tags;
    }

    get horse(): Horse
    {
        return this._horse
    }

    get deleted(): boolean
    {
        return this._deleted
    }

    get postDate(): Date
    {
        return this._postDate
    }

    isTitle(title: string): boolean
    {
        return this.title === title
    }

    isType(type: PostType):boolean
    {
        return this.type === type
    }

    isAuthor(author: string):boolean
    {
        return this.author === author
    }

    isSubtitle(subtitle: string):boolean
    {
        return this.subtitle === subtitle
    }

    isContent(content: string):boolean
    {
        return this.content === content
    }

    isCreatedDate(date: Date):boolean
    {
        return this.createdDate.getTime() === date.getTime()
    }

    isStatus(status: PostStatus): boolean
    {
        return this.status === status
    }

    isEpigraph(epigraph: string): boolean
    {
        return this.epigraph === epigraph
    }

    isSlug(slug: string):boolean
    {
        return this.slug === slug
    }

    isTags(tags: string):boolean
    {
        return this.tags === tags
    }

    isHorse(horse: Horse):boolean
    {
        return this.horse.isEqual(horse)
    }

    delete(){
        this._deleted = true
    }

    sync(newPost: Post): void
    {
        this._title = newPost.title
        this._type = newPost.type;
        this._author = newPost.author;
        this._subtitle = newPost.subtitle;
        this._content = newPost.content;
        this._postDate = newPost.postDate;
        this._status = newPost.status;
        this._epigraph = newPost.epigraph;
        this._slug = newPost.slug;
        this._tags = newPost.tags;
        this._horse = newPost.horse;
    }

    toJSON()
    {
        return {
            "id": this.id,
            "title": this.title,
            "type": this.type,
            "author": this.author,
            "subtitle": this.subtitle,
            "content": this.content,
            "postDate": this.postDate,
            "status": this.status,
            "epigraph": this.epigraph,
            "slug": this.slug,
            "tags": this.tags,
            "horse": this.horse
        }
    }



}