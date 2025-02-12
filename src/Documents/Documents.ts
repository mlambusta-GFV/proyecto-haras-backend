import {Document} from "./Document";
import {Horse} from "../Horse/Horse";

export abstract class Documents {
    static readonly ERROR_DUPLICATED_DOCUMENT = 'Can not add duplicated document'
    static readonly ERROR_DOCUMENT_NOT_FOUND = 'Document not found'

    abstract getAll(): Promise<unknown[]>;

    async assertDuplicatedDocument(newDocument: Document) {
        if (await this.hasDocument(newDocument))
            throw new Error(Documents.ERROR_DUPLICATED_DOCUMENT)
    }

    abstract add(documentation: string, horse: Horse): Promise<Document>;

    abstract amounts(): Promise<any>;

    abstract hasDocument(documentToCompare: Document): Promise<boolean>;

    abstract hasDocumentation(documentation: string): Promise<boolean>;

    abstract findById(documentId: number, failedClosure: () => void): any;

    abstract findByHorse(horseId: number, failedClosure: () => void): any;

    abstract findAndUpdate(documentId: number, documentation: string, horse: Horse): any;

    abstract findByDocumentation(documentation: String, failedClosure: () => void): unknown;

    abstract softDeleteFromDocument(documentId: number):void;
}