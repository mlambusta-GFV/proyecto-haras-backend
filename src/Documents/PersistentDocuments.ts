import { createQueryBuilder, getManager, QueryRunner } from "typeorm";
import { Document } from "./Document";
import { Documents } from "./Documents";
import { Horse } from "../Horse/Horse";

export class PersistentDocuments extends Documents {
    private queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        super()
        this.queryRunner = queryRunner
    }

    async hasDocument(documentToCompare: Document) {
        return this.hasDocumentation(documentToCompare.documentation)
    }

    async add(documentation: string, horse: Horse): Promise<Document> {
        const newDocument = Document.initialize(documentation, horse)
        await this.assertDuplicatedDocument(newDocument)

        await this.queryRunner.manager.save(newDocument);
        return newDocument;
    }

    async amounts() {
        return await this.queryRunner.manager.count(Document);
    }

    async hasDocumentation(documentation: string): Promise<boolean> {
        const documentationFound = await this.queryRunner.query(`SELECT 1 FROM document WHERE _documentation = '${documentation}'`)
        return documentationFound.length > 0;
    }

    async findById(documentId: number, failedClosure: () => void): Promise<void | Document> {
        const documentFound = await this.queryRunner.manager.findOne(Document, {
            where: { _id: documentId, _deleted: false },
            relations: ["_horse"]
        });
        if (documentFound === undefined)
            return failedClosure()
        return documentFound
    }

    async findByHorse(horseId: number, failedClosure: () => void): Promise<void | Document[]> {
        const documentFound = await this.queryRunner.manager.find(Document, {
            where: { _horse: horseId, _deleted: false },
        });
        if (documentFound === undefined)
            return failedClosure()
        return documentFound
    }

    async findByDocumentation(documentation: string, failedClosure: () => void): Promise<void | Document> {
        const documentFound = await this.queryRunner
            .manager
            .findOne(Document, { where: { _documentation: documentation, _deleted: false }, relations: ["_horse"] });
        if (documentFound === undefined)
            return failedClosure()
        return documentFound
    }

    async getAll() {
        return await this.queryRunner.manager.find(Document, { where: { _deleted: false }, relations: ["_horse"] });
    }

    async softDeleteFromDocument(documentId: number) {
        await createQueryBuilder()
            .update("document")
            .set({ _deleted: 1 })
            .where("_id = :id", { id: documentId })
            .execute();
    }

    async findAndUpdate(documentId: number, documentation: string, horse: Horse) {

        const document = await this.findById(documentId, () => { throw new Error(Documents.ERROR_DOCUMENT_NOT_FOUND) })
        //@ts-ignore
        document.setDocumentation(documentation)
        //@ts-ignore
        document.setHorse(horse)

        const entityManager = getManager();
        await entityManager.save(document);

        return document
    }
}