import {ChildEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn} from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "_type" } })
abstract class ValueList {
    static readonly ERROR_ENTITY_BLANK = "Entity can not be blank"
    static readonly ERROR_GROUP_BLANK = "Group can not be blank"
    static readonly ERROR_KEY_BLANK = "Key can not be black"
    static readonly ERROR_VALUE_BLANK = "Value can not be black"
    static readonly ERROR_ORDER_BLANK = "Order must be greater than zero"
    static readonly ERROR_INCORRECT_ID = "The Id is not a sex"

    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _key: string;
    @Column("text")
    private _value: string;
    @Column("int")
    private _order: number;
    @Column({type: "boolean", default: false})
    private _filter: boolean;
    @Column("text")
    private _description: string;
    @Column({type: "boolean", default: false})
    private _deleted: boolean;
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;

    static assertNotEmptyKey(key: string) {
        if (key.trim().length === 0)
            throw new Error(this.ERROR_KEY_BLANK)
    }

    static assertNotEmptyValue(value: string) {
        if (value.trim().length === 0)
            throw new Error(this.ERROR_VALUE_BLANK)
    }

    static assertNotEmptyOrder(order: number) {
        if (order <= 0)
            throw new Error(this.ERROR_ORDER_BLANK)
    }

    protected constructor(key: string, value: string, order: number, filter: boolean, description: string) {
        this._key = key
        this._value = value
        this._order = order
        this._filter = filter
        this._description = description
    }

    get id(): number {
        return this._id
    }

    get key(): string {
        return this._key
    }

    get value(): string {
        return this._value;
    }

    get order(): number {
        return this._order
    }

    get filter(): boolean {
        return this._filter;
    }

    get description(): string {
        return this._description;
    }

    get createdDate(): Date {
        return this._createdDate;
    }

    get updatedDate(): Date {
        return this._updatedDate;
    }

    get deleted(): boolean {
        return this._deleted;
    }

    isEquals(ValueListToCompare: ValueList) {
        return this.key === ValueListToCompare.key && this.value === ValueListToCompare.value
    }

    keyIs(key: string) {
        return this.key === key
    }

    valueIs(value: string) {
        return this.value === value
    }

    orderIs(order: number) {
        return this.order === order
    }

    descriptionIs(description:string) {
        return this.description === description
    }

    deletedIs(deleted: boolean) {
        return this.deleted === deleted
    }

    filterIs(filter: boolean) {
        return this.filter === filter
    }

    sync(newValueList: ValueList){
        this._key = newValueList.key
        this._value = newValueList.value
        this._order = newValueList.order
        this._filter = newValueList.filter
        this._description = newValueList.description
    }

    toJSON():{id: number, key: string, value: string, order: number, filter: boolean,
        description: string}{
        return {
            "id": this.id,
            "key": this.key,
            "value": this.value,
            "order": this.order,
            "filter": this.filter,
            "description": this.description,
        }
    }
}

@ChildEntity()
class Sex extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }

    isSex(sexToCompare: Sex){
        return this.keyIs(sexToCompare.key)
    }
}

@ChildEntity()
class Fur extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }
}

@ChildEntity()
class PostType extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }

    isPostType(postTypeToCompare: PostType){
        return this.keyIs(postTypeToCompare.key)
    }
}

@ChildEntity()
class PostStatus extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }

    isPostStatus(postStatusToCompare: PostStatus){
        return this.keyIs(postStatusToCompare.key)
    }
}

@ChildEntity()
class FileType extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }
}

@ChildEntity()
class TasksType extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }

    isTasksType(taskStatusToCompare: TasksType){
        return this.keyIs(taskStatusToCompare.key)
    }
}

@ChildEntity()
class ClasificationName extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }

    isClasificationName(ToCompare: TasksType){
        return this.keyIs(ToCompare.key)
    }
}

@ChildEntity()
class InterventionType extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }
}

@ChildEntity()
class JumpValues extends ValueList {
    static initialize(key: string, value: string, order: number, filter: boolean, description: string) {
        this.assertNotEmptyKey(key)
        this.assertNotEmptyValue(value)
        this.assertNotEmptyOrder(order)

        return new this(key, value, order, filter, description)
    }
}

export {ValueList, Sex, Fur, PostStatus, PostType, FileType, TasksType, ClasificationName, InterventionType, JumpValues}
