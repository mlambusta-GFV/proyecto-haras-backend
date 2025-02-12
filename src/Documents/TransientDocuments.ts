import { Document } from "./Document";
import { Documents } from "./Documents";
import { Horse } from "../Horse/Horse";

export class TransientDocuments extends Documents {
    private _documents: Map<number, Document>
    private lastId: number = 1

    constructor(documents: Map<number, Document>) {
        super();
        this._documents = documents
    }

    get documents(): Map<number, Document> {
        return this._documents;
    }

    async getAll() {
        return Array.from(this.documents.values())
    }
    async add(documentation: string, horse: Horse): Promise<Document> {
        const newDocument = Document.initialize(documentation, horse)
        await this.assertDuplicatedDocument(newDocument)
        this._documents.set(this.lastId, newDocument)
        this.lastId++
        return newDocument
    }
    async amounts() {
        return this.documents.size
    }
    async hasDocument(documentToCompare: Document) {
        const documents = Array.from(this.documents.values())
        return documents.some((document) => document.isEquals(documentToCompare));
    }
    async hasDocumentation(documentation: string) {
        const documents = Array.from(this.documents.values())
        return documents.some((document: Document) => document.documentationIs(documentation));
    }
    findById(documentId: number, failedClosure: () => void): any {
        const documentationFound = this.documents.get(documentId)
        if (documentationFound === undefined)
            return failedClosure()
        return documentationFound
    }

    findByDocumentation(documentation: string, failedClosure: () => void) {
        const documents = Array.from(this.documents.values())
        const documentationFound = documents.find((document) => document.documentationIs(documentation));
        if (documentationFound === undefined)
            return failedClosure()
        return documentationFound
    }

    softDeleteFromDocument(documentId: number) {

    }

    findAndUpdate(documentId: number, documentation: string, horse: Horse) {

    }

    findByHorse(horseId: number, failedClosure: () => void): any {

    }

}