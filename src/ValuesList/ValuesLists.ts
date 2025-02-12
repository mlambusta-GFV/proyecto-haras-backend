import {ClasificationName, FileType, Fur, PostStatus, PostType, Sex, TasksType, ValueList} from "./ValueList";

export abstract class ValuesLists {
    static readonly ERROR_DUPLICATED_VALUELIST = "Can not add duplicated ValueList"
    static readonly ERROR_NOT_FOUND = "ValuesList not found"
    static readonly ERROR_PARAMETERS = "Wrong parameters"
    static readonly ERROR_UPDATE = "Error trying to update"

    abstract getAll(deleted?: boolean): Promise<unknown[]>;

    async assertDuplicatedValueList(newValueList: ValueList) {
        if (await this.hasValueList(newValueList))
            throw new Error(ValuesLists.ERROR_DUPLICATED_VALUELIST)
    }

    abstract addSex(key: string, value: string, order: number, filter: boolean, description: string): Promise<Sex>;

    abstract addPostType(key: string, value: string, order: number, filter: boolean, description: string): Promise<PostType>;

    abstract addPostStatus(key: string, value: string, order: number, filter: boolean, description: string): Promise<PostStatus>;

    abstract amountSex(): Promise<any>;

    abstract hasValueList(valuelistToCompare: ValueList): Promise<boolean>;

    abstract delete(id: number): any;

    abstract updateSex(valuesList: ValueList): any;

    abstract updatePostStatus(valuesList: ValueList): any;

    abstract updatePostType(valuesList: ValueList): any;

    abstract findById(type: string, Id: number, failedClosure: () => void): any;

    abstract findSexByKey(key: string, failedClosure: () => void): Promise<void | Sex>

    abstract findBySexId(id: number, failedClosure: () => void): Promise<void | Sex>

    abstract hasSex(sex: Sex): Promise<boolean>

    abstract getAllSex(): Promise<Sex[]>

    abstract addFur(key: string, value: string, order: number, filter: boolean, description: string): Promise<Fur>;
    
    abstract addJumpValues(key: string, value: string, order: number, filter: boolean, description: string): Promise<Fur>;

    abstract updateJumpValues(valuesList: ValueList): Promise<any>;

    abstract updateFur(valuesList: ValueList): Promise<any>;

    abstract findByJumpValuesId(id: number, failedClosure: () => void): Promise<any | void>;

    abstract amountFur(): Promise<any>;

    abstract findByFurId(id: number, failedClosure: () => void): Promise<any | void>;

    abstract getAllFur(deleted: boolean): Promise<any>;

    abstract findTypeByExtensionFile(fileTypeName: string, failedClosure: () => void): Promise<unknown>

    abstract addFileType(key: string, value: string, order: number, filter: boolean, description: string): Promise<FileType>;

    abstract findByPostTypeId(id: number, failedClosure: () => void): Promise<void | PostType>

    abstract hasPostType(type: PostType): Promise<boolean>

    abstract getAllPostType(deleted: boolean): Promise<PostType[]>

    abstract findByPostStatusId(id: number, failedClosure: () => void): Promise<void | PostStatus>

    abstract hasPostStatus(status: PostStatus): Promise<boolean>

    abstract getAllPostStatus(deleted: boolean): Promise<PostStatus[]>

    abstract addTasksType(key: string, value: string, order: number, filter: boolean, description: string): Promise<TasksType>;

    abstract updateTasksType(valuesList: ValueList): any;

    abstract findByTasksTypeId(id: number, failedClosure: () => void): Promise<void | TasksType>

    abstract hasTasksType(type: TasksType): Promise<boolean>

    abstract getAllTasksType(deleted: boolean): Promise<TasksType[]>

    abstract addClasificationName(key: string, value: string, order: number, filter: boolean, description: string): Promise<ClasificationName>;

    abstract updateClasificationName(valuesList: ValueList): any;

    abstract findByClasificationNameId(id: number, failedClosure: () => void): Promise<void | ClasificationName>

    abstract findByClasificationNamekey(key: string, failedClosure: () => void): Promise<void | ClasificationName>

    abstract hasClasificationName(type: ClasificationName): Promise<boolean>

    abstract getAllClasificationName(deleted: boolean): Promise<any[]>

    abstract getAllFileType(): Promise<FileType[]>

    abstract findFurByKey(key: string, failedClosure: () => void): Promise<any | Fur>;

    abstract findByKey(type: string, key: string, failedClosure: () => void): Promise<any>;

    abstract addInterventionType(key: string, value: string, order: number, filter: boolean, description: string): Promise<any>

    abstract getAllByType(type: string, deleted: boolean): Promise<any>;

    abstract getAllJump( deleted: boolean): Promise<any>;
}
