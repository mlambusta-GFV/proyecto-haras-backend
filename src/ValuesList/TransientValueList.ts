import {Fur, TasksType, PostStatus, PostType, Sex, ValueList, FileType, ClasificationName} from "./ValueList";
import {ValuesLists} from "./ValuesLists";

export class TransientValueList extends ValuesLists{
    addJumpValues(key: string, value: string, order: number, filter: boolean, description: string): Promise<Fur> {
        throw new Error("Method not implemented.");
    }
    updateJumpValues(valuesList: ValueList): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findByJumpValuesId(id: number, failedClosure: () => void): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAllJump(deleted: boolean): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAllByType(type: string, deleted: boolean): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findByKey(type: string, key: string, failedClosure: () => void): Promise<any> {
        throw new Error("Method not implemented.");
    }
    findByClasificationNamekey(key: string, failedClosure: () => void): Promise<void | ClasificationName> {
        throw new Error("Method not implemented.");
    }
    addClasificationName(key: string, value: string, order: number, filter: boolean, description: string): Promise<ClasificationName> {
        throw new Error("Method not implemented.");
    }
    updateClasificationName(valuesList: ValueList) {
        throw new Error("Method not implemented.");
    }
    findByClasificationNameId(id: number, failedClosure: () => void): Promise<void | ClasificationName> {
        throw new Error("Method not implemented.");
    }
    hasClasificationName(type: ClasificationName): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getAllClasificationName(deleted: boolean): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    findSexByKey(key: string, failedClosure: () => void): Promise<void | Sex> {
        throw new Error("Method not implemented.");
    }
    addTasksType(key: string, value: string, order: number, filter: boolean, description: string): Promise<TasksType> {
        throw new Error("Method not implemented.");
    }
    updateTasksType(valuesList: ValueList) {
        throw new Error("Method not implemented.");
    }
    findByTasksTypeId(id: number, failedClosure: () => void): Promise<void | TasksType> {
        throw new Error("Method not implemented.");
    }
    hasTasksType(type: TasksType): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getAllTasksType(deleted: boolean): Promise<TasksType[]> {
        throw new Error("Method not implemented.");
    }
    addPostType(key: string, value: string, order: number, filter: boolean, description: string): Promise<PostType> {
        throw new Error("Method not implemented.");
    }
    addPostStatus(key: string, value: string, order: number, filter: boolean, description: string): Promise<PostStatus> {
        throw new Error("Method not implemented.");
    }
    updatePostStatus(valuesList: ValueList) {
        throw new Error("Method not implemented.");
    }
    updatePostType(valuesList: ValueList) {
        throw new Error("Method not implemented.");
    }
    findByPostTypeId(id: number, failedClosure: () => void): Promise<void | PostType> {
        throw new Error("Method not implemented.");
    }
    hasPostType(type: PostType): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getAllPostType(deleted: boolean): Promise<PostType[]> {
        throw new Error("Method not implemented.");
    }
    findByPostStatusId(id: number, failedClosure: () => void): Promise<void | PostStatus> {
        throw new Error("Method not implemented.");
    }
    hasPostStatus(status: PostStatus): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getAllPostStatus(deleted: boolean): Promise<PostStatus[]> {
        throw new Error("Method not implemented.");
    }
    private _valuesLists: Map<number,ValueList>
    private lastId = 1

    constructor(valuesLists: Map<number,ValueList>) {
        super();
        this._valuesLists = valuesLists
    }

    get valuesLists(): Map<number,ValueList> {
        return this._valuesLists;
    }

    async getAll(deleted = false) {
        return Array.from(this.valuesLists.values())
    }

    async addSex(key: string, value: string, order: number, filter: boolean, description: string): Promise<Sex> {
        const newValueList = Sex.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newValueList)
        this._valuesLists.set(this.lastId, newValueList)
        this.lastId++
        return newValueList
    }

    async updateSex(valuesList: ValueList) {
        const newValueList = valuesList;

        return newValueList;
    }

    amountSex(): Promise<any> {
        return Promise.resolve(this.valuesLists.size)
    }
    
    async hasValueList(valuesListToCompare: ValueList) {
        const valuesLists = Array.from(this.valuesLists.values())
        return valuesLists.some((valuesList) => valuesList.isEquals(valuesListToCompare));
    }

    findById(type: string, Id: number, failedClosure: () => void): any {
        const ValueListFound = this.valuesLists.get(Id)
        if (ValueListFound === undefined)
            return failedClosure()
        return ValueListFound
    }

     delete(id: number){
        this.valuesLists.delete(id)
        return Array.from(this.valuesLists.values())
     }

    hasSex(sex: Sex): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async findBySexId(id: number, failedClosure: () => void): Promise<Sex> {
        throw new Error("Method not implemented.");
    }

    async getAllSex(): Promise<Sex[]> {
        throw new Error("Method not implemented.");
    }

    addFur(key: string, value: string, order: number, filter: boolean, description: string): Promise<Fur> {
        return Promise.resolve(undefined);
    }

    amountFur(): Promise<any> {
        return Promise.resolve(undefined);
    }

    findByFurId(id: number, failedClosure: () => void): Promise<any> {
        return Promise.resolve(undefined);
    }

    getAllFur(deleted:boolean): Promise<any> {
        return Promise.resolve(undefined);
    }

    updateFur(valuesList: ValueList): Promise<any> {
        return Promise.resolve(undefined);
    }

    findFileTypeByName(fileTypeName: string, failedClosure: () => void): Promise<void | FileType> {
        return Promise.resolve(undefined);
    }

    addFileType(key: string, value: string, order: number, filter: boolean, description: string): Promise<FileType> {
        return Promise.resolve(undefined);
    }

    findTypeByExtensionFile(fileTypeName: string, failedClosure: () => void): Promise<unknown> {
        return Promise.resolve(undefined);
    }

    getAllFileType(): Promise<FileType[]> {
        return Promise.resolve(undefined);
    }

    findFurByKey(key: string, failedClosure: () => void): Promise<any> {
        return Promise.resolve(undefined);
    }

    addInterventionType(key: string, value: string, order: number, filter: boolean, description: string): Promise<any> {
        return Promise.resolve(undefined);
    }

}