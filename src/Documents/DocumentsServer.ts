import { HarasSystem } from "../HarasSystem";
import { Documents } from "./Documents";

export class DocumentsServer {
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.post('/documents', async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const documents = this._system.documents()
                const { documentation, horseId } = request.body
                // @ts-ignore
                await documents.add(documentation, horseId)
                await this._system.commitTransaction()
                response.json({ status: 'OK' })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.get('/documents', async (request: any, response: any) => {
            try {
                const documents = this._system.documents()

                let allDocuments = await documents.getAll();
                response.json(allDocuments)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get('/documents/:id', async (request: any, response: any) => {
            try {
                const documents = this._system.documents()
                const idDocument = request.params.id
                let document = await documents.findById(idDocument, () => { throw new Error(Documents.ERROR_DOCUMENT_NOT_FOUND) })

                response.json(document)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get('/documents/horse/:horseId', async (request: any, response: any) => {
            try {
                const documents = this._system.documents()
                const horseId = request.params.horseId
                let document = await documents.findByHorse(horseId, () => { throw new Error(Documents.ERROR_DOCUMENT_NOT_FOUND) })

                response.json(document)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.delete('/documents/:id', async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const documents = this._system.documents()
                const idDocument = request.params.id
                documents.softDeleteFromDocument(idDocument)
                await this._system.commitTransaction()
                response.json({ status: 'OK' })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.put('/documents/:id', async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const documents = this._system.documents()
                const idDocument = request.params.id
                const {documentation, horse } = request.query
                let document = await documents.findAndUpdate(idDocument, documentation, horse)
                await this._system.commitTransaction()
                response.json(document)
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

    }
}