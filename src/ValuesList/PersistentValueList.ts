/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createQueryBuilder, QueryRunner } from "typeorm";
import {
    ClasificationName,
    FileType,
    Fur,
    InterventionType,
    PostStatus,
    PostType,
    Sex,
    TasksType,
    JumpValues,
    ValueList
} from "./ValueList";
import { ValuesLists } from "./ValuesLists";
import { HistoryClassifications } from "../HistoryClassification/HistoryClassifications";

export class PersistentValueList extends ValuesLists {
    

    async getAllJump(deleted: boolean): Promise<JumpValues[]> {
        if (!deleted) {
            return await this.queryRunner.manager.find(JumpValues)
        }
        return await this.queryRunner.manager.find(JumpValues, { where: { _deleted: deleted } })
    }

    async addClasificationName(key: string, value: string, order: number, filter: boolean, description: string): Promise<ClasificationName> {
        const newtype = ClasificationName.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newtype)
        await this.queryRunner.manager.save(newtype);

        return newtype;
    }

    async updateClasificationName(valuesList: ValueList) {
        const newType = ClasificationName.initialize(valuesList.key, valuesList.value, valuesList.order, valuesList.filter, valuesList.description)
        const typeFound = await this.findByTasksTypeId(valuesList.id, () => {
            throw new Error(ValuesLists.ERROR_NOT_FOUND)
        })
        // @ts-ignore
        typeFound.sync(newType)
        return await this.queryRunner.manager.save(typeFound)
    }

    async findByClasificationNamekey(key: string, failedClosure: () => void): Promise<void | ClasificationName> {
        return await this.findByKey("ClasificationName", key, failedClosure)
    }

    async findByClasificationNameId(id: number, failedClosure: () => void): Promise<void | ClasificationName> {
        return this.findById("ClasificationName", id, failedClosure)
    }

    async hasClasificationName(type: ClasificationName): Promise<boolean> {
        const valuelistFound = await this.queryRunner
            .manager
            .find(ClasificationName, { where: { _id: type.id } })
        if (valuelistFound === undefined)
            return false
        return true
    }
    async getAllClasificationName(deleted: boolean): Promise<any[]> {
        if (deleted) {
            return await this.queryRunner.manager.find(ClasificationName)
        }
        const classificationsName = await this.queryRunner.manager.find(ClasificationName, { where: { _deleted: deleted } })

        return Promise.all(classificationsName.map(async (classification, index) => {
            return {
                id: classification.id,
                key: classification.key,
                value: classification.value,
                order: classification.order,
                filter: classification.filter,
                description: classification.description,
                horseRequired: HistoryClassifications.RELATED_HORSE_REQUIRED[index],
                stockRequired: HistoryClassifications.STOCK_REQUIRED[index]
            }
        }))
    }

    async getAllByType(type: string, deleted: boolean): Promise<any> {
        if (deleted) {
            return await this.queryRunner.manager.find(type)
        }
        return await this.queryRunner.manager.find(type, { where: { _deleted: deleted } })
    }

    async addTasksType(key: string, value: string, order: number, filter: boolean, description: string): Promise<TasksType> {
        const newtype = TasksType.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newtype)
        await this.queryRunner.manager.save(newtype);

        return newtype;
    }

    async updateTasksType(valuesList: ValueList) {
        const newType = TasksType.initialize(valuesList.key, valuesList.value, valuesList.order, valuesList.filter, valuesList.description)
        const typeFound = await this.findByTasksTypeId(valuesList.id, () => {
            throw new Error(ValuesLists.ERROR_NOT_FOUND)
        })
        // @ts-ignore
        typeFound.sync(newType)
        return await this.queryRunner.manager.save(typeFound)
    }

    async findByTasksTypeId(id: number, failedClosure: () => void): Promise<void | TasksType> {
        return this.findById("TasksType", id, failedClosure)
    }

    async hasTasksType(type: TasksType): Promise<boolean> {
        const valuelistFound = await this.queryRunner
            .manager
            .find(TasksType, { where: { _id: type.id } })
        if (valuelistFound === undefined)
            return false
        return true
    }

    async getAllTasksType(deleted: boolean): Promise<TasksType[]> {
        if (deleted) {
            return await this.queryRunner.manager.find(TasksType)
        }
        return await this.queryRunner.manager.find(TasksType, { where: { _deleted: deleted } })
    }

    async addPostType(key: string, value: string, order: number, filter: boolean, description: string): Promise<PostType> {
        const newtype = PostType.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newtype)
        await this.queryRunner.manager.save(newtype);

        return newtype;
    }

    async addPostStatus(key: string, value: string, order: number, filter: boolean, description: string): Promise<PostStatus> {
        const newStatus = PostStatus.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newStatus)
        await this.queryRunner.manager.save(newStatus);

        return newStatus;
    }

    async updatePostStatus(valuesList: ValueList) {
        const newStatus = PostStatus.initialize(valuesList.key, valuesList.value, valuesList.order, valuesList.filter, valuesList.description)
        const statusFound = await this.findByPostStatusId(valuesList.id, () => {
            throw new Error(ValuesLists.ERROR_NOT_FOUND)
        })
        // @ts-ignore
        statusFound.sync(newStatus)
        return await this.queryRunner.manager.save(statusFound)
    }

    async updatePostType(valuesList: ValueList) {
        const newType = PostType.initialize(valuesList.key, valuesList.value, valuesList.order, valuesList.filter, valuesList.description)
        const typeFound = await this.findByPostTypeId(valuesList.id, () => {
            throw new Error(ValuesLists.ERROR_NOT_FOUND)
        })
        // @ts-ignore
        typeFound.sync(newType)
        return await this.queryRunner.manager.save(typeFound)
    }

    async findByPostTypeId(id: number, failedClosure: () => void): Promise<void | PostType> {
        return this.findById("PostType", id, failedClosure)
    }

    async findByPostStatusId(id: number, failedClosure: () => void): Promise<void | PostStatus> {
        return this.findById("PostStatus", id, failedClosure)
    }

    async hasPostType(type: PostType): Promise<boolean> {
        const valuelistFound = await this.queryRunner
            .manager
            .find(PostType, { where: { _id: type.id } })
        if (valuelistFound === undefined)
            return false
        return true
    }

    async hasPostStatus(status: PostStatus): Promise<boolean> {
        const valuelistFound = await this.queryRunner
            .manager
            .find(PostType, { where: { _id: status.id } })
        if (valuelistFound === undefined)
            return false
        return true
    }

    async getAllPostType(deleted: boolean): Promise<PostType[]> {
        if (deleted) {
            return await this.queryRunner.manager.find(PostType)
        }
        return await this.queryRunner.manager.find(PostType, { where: { _deleted: deleted } })
    }

    async getAllPostStatus(deleted: boolean): Promise<PostStatus[]> {
        if (deleted) {
            return await this.queryRunner.manager.find(PostStatus)
        }
        return await this.queryRunner.manager.find(PostStatus, { where: { _deleted: deleted } })
    }

    private queryRunner: QueryRunner;

    public static readonly ERROR_TYPE_NOT_FOUND = "Not found value list type"

    constructor(queryRunner: QueryRunner) {
        super()
        this.queryRunner = queryRunner
    }

    async hasValueList(valuelistToCompare: ValueList) {
        const valuelistFound = await this.queryRunner
            .manager
            .count(ValueList, { where: { _key: valuelistToCompare.key } })
        return valuelistFound > 0;
    }

    //TODO: faltan asserts por si los campos son nulos
    async addSex(key: string, value: string, order: number, filter: boolean, description: string): Promise<Sex> {
        const newSex = Sex.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newSex)
        await this.queryRunner.manager.save(newSex);

        return newSex;
    }

    async findByKey(type: string, key: string, failedClosure: () => void): Promise<any> {
        const valueListFound = await this.queryRunner
            .manager
            .findOne(type, { where: { _key: key, _deleted: false } })
        if (valueListFound === undefined)
            return failedClosure()
        return valueListFound
    }

    async findSexByKey(key: string, failedClosure: () => void): Promise<void | Sex> {
        return await this.findByKey("Sex", key, failedClosure)
    }

    async findFurByKey(key: string, failedClosure: () => void): Promise<any | Fur> {
        return await this.findByKey("Fur", key, failedClosure)
    }

    //TODO: falta controlar si es duplicado
    async updateSex(valuesList: ValueList) {
        const newSex = Sex.initialize(valuesList.key, valuesList.value, valuesList.order, valuesList.filter, valuesList.description)
        const sexFound = await this.findBySexId(valuesList.id, () => { throw new Error(ValuesLists.ERROR_NOT_FOUND) })
        // @ts-ignore
        sexFound.sync(newSex)

        return await this.queryRunner.manager.save(sexFound)
    }

    async amountSex(): Promise<any> {
        return await this.queryRunner.manager.count(Sex);
    }

    async findById(type: string, Id: number, failedClosure: () => void): Promise<any> {
        const valuelistFound = await this.queryRunner
            .manager
            .findOne(ValueList, { where: { _id: Id, _deleted: false } })
        if (valuelistFound === undefined)
            return failedClosure()
        return valuelistFound
    }

    async findBySexId(id: number, failedClosure: () => void) {
        return this.findById("Sex", id, failedClosure)
    }

    async getAllSex(deleted = false) {
        return await this.queryRunner.manager
            .find(Sex, { where: { _deleted: deleted } })
    }

    //TODO: faltan asserts por si los campos son nulos
    async addFur(key: string, value: string, order: number, filter: boolean, description: string): Promise<Fur> {
        const newFur = Fur.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newFur)
        await this.queryRunner.manager.save(newFur);
        return newFur;
    }

    //TODO: faltan asserts por si los campos son nulos
    async addJumpValues(key: string, value: string, order: number, filter: boolean, description: string): Promise<Fur> {
        const newJumpValues = JumpValues.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newJumpValues)
        await this.queryRunner.manager.save(newJumpValues);
        return newJumpValues;
    }

    //TODO: falta controlar si es duplicado
    async updateFur(valuesList: ValueList) {
        const newFur = Fur.initialize(valuesList.key, valuesList.value, valuesList.order, valuesList.filter, valuesList.description)
        const furFound = await this.findBySexId(valuesList.id, () => {
            throw new Error(ValuesLists.ERROR_NOT_FOUND)
        })
        // @ts-ignore
        furFound.sync(newFur)
        return await this.queryRunner.manager.save(furFound)
    }

    async updateJumpValues(valuesList: ValueList) {
        const newJumpValues = JumpValues.initialize(valuesList.key, valuesList.value, valuesList.order, valuesList.filter, valuesList.description)
        const jumpValuesFound = await this.findBySexId(valuesList.id, () => {
            throw new Error(ValuesLists.ERROR_NOT_FOUND)
        })
        // @ts-ignore
        jumpValuesFound.sync(newJumpValues)
        return await this.queryRunner.manager.save(jumpValuesFound)
    }

    async amountFur(): Promise<any> {
        return await this.queryRunner.manager.count(Fur);
    }

    async findByFurId(id: number, failedClosure: () => void) {
        return this.findById("Fur", id, failedClosure)
    }

    async findByJumpValuesId(id: number, failedClosure: () => void) {
        return this.findById("JumpValues", id, failedClosure)
    }

    async getAllFur(deleted = false) {
        return await this.queryRunner.manager
            .find(Fur, { where: { _deleted: deleted } })
    }

    async getAll(deleted = false) {
        return await this.queryRunner.manager
            .find(ValueList, { where: { _deleted: deleted } })
    }

    async delete(id: number) {
        await createQueryBuilder()
            .update("value_list")
            .set({ deleted: true })
            .where("_id = :id", { id: id })
            .execute();
    }

    async hasSex(sex: Sex) {
        const sexFound = await this.queryRunner
            .manager
            .findOne(Sex, { where: { _id: sex.id } })
        if (sexFound === undefined)
            return false
        return true
    }

    async findTypeByExtensionFile(fileTypeName: string, failedClosure: () => void): Promise<unknown> {
        const valuelistFound = await createQueryBuilder("FileType")
            .where(`_value like '%${fileTypeName.toLowerCase()}%'`)
            .getOne()
        if (valuelistFound === undefined)
            return failedClosure()
        return valuelistFound
    }

    async addFileType(key: string, value: string, order: number, filter: boolean, description: string): Promise<FileType> {
        const newFileType = FileType.initialize(key, value, order, filter, description)
        await this.assertDuplicatedValueList(newFileType)
        await this.queryRunner.manager.save(newFileType);
        return newFileType;
    }

    async getAllFileType(): Promise<FileType[]> {
        return await this.queryRunner.manager
            .find(FileType, { where: { _deleted: false } })
    }

    async addInterventionType(key: string, value: string, order: number, filter: boolean, description: string): Promise<any> {
        // @ts-ignore
        const type = InterventionType.initialize(key, value, order, filter, description)
        await this.queryRunner.manager.save(type);
        return type;
    }
}