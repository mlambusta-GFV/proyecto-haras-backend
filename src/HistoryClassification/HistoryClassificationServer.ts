import { HarasSystem } from "../HarasSystem";
import { HistoryClassifications } from "./HistoryClassifications";

export class HistoryClassificationServer {
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.post("/historyclassification", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction();

                const historyClassification = this._system.historyClassification();
                const { clasificationNameId, date, horseId, relatedHorseId, cycle, comment} = request.body
                // @ts-ignore
                await historyClassification.add(clasificationNameId, date, horseId, relatedHorseId, cycle, comment)

                await this._system.commitTransaction();
                response.json({ status: "OK" })
            }
            catch (error) {
                await this._system.rollbackTransaction();
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/historyclassification", async (request: any, response: any) => {
            try {
                const historyClassification = this._system.historyClassification()
                const allHistoryClassification = await historyClassification.getAll();
                response.json(allHistoryClassification)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/historyclassification/byId/:id", async (request: any, response: any) => {
            try {
                const historyClassification = this._system.historyClassification()
                const id = request.params.id
                const HistoryClassification = await historyClassification.getHistoryClassificationbyId(id, () => { throw new Error(HistoryClassifications.ERROR_HORSE_NOT_FOUND)});
                response.json(HistoryClassification)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.put("/historyclassification/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction();
                const historyClassification = this._system.historyClassification();
                const id = request.params.id;
                const {date, comment, relatedHorseId}= request.body
                const HistoryClassification = await historyClassification.update(id,date,relatedHorseId,comment);
                response.json(HistoryClassification);
                await this._system.commitTransaction();
            }
            catch (error) {
                await this._system.rollbackTransaction();
                response.status(400).json({ msg: error.message })
            }
        })

        server.delete("/historyclassification/:id", async (request: any, response: any) => {
            try {
                const historyClassification = this._system.historyClassification()
                const id = request.params.id
                const HistoryClassification = await historyClassification.deleteHistoryClassificationbyId(id);
                response.json(HistoryClassification)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/historyclassification/possibleNextStatus", async (request: any, response: any) => {
            try {
                const historyClassification = this._system.historyClassification()
                const actualClassification: number =  parseInt(request.query.actualClassification)
                const horseId: number = parseInt(request.query.horseId)
                const resutls = await historyClassification.possibleNextStatus(horseId, actualClassification, () => { throw new Error(HistoryClassifications.ERROR_HORSE_NOT_FOUND) })

                response.json(resutls)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/historyclassification/lastbyhorse/:id", async (request: any, response: any) => {
            try {
                const historyClassification = this._system.historyClassification()
                const horseId = request.params.id
                const resutls = await historyClassification.findLastClasificationByHorseId(horseId, () => { throw new Error(HistoryClassifications.ERROR_HORSE_NOT_FOUND) })

                response.json(resutls)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.post("/historyclassification/changestatus", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()

                const historyClassification = this._system.historyClassification()
                let { actualStatus, nextStatus, horseId, relatedHorseId, comment , date, stock, dosis} = request.body
                
                date = date != undefined && date != ""? date : new Date();
                stock = stock != undefined && stock != ""? stock : 0;
                dosis = dosis != undefined && dosis != ""? dosis : 0;
                // @ts-ignore
                await historyClassification.changeStatus(actualStatus, nextStatus, horseId, relatedHorseId, comment, date, parseInt(stock),  parseInt(dosis),() => { throw new Error(HistoryClassifications.ERROR_INCOMPATIBLE_STATUS)})

                await this._system.commitTransaction()
                response.json({ status: "OK" })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.delete("/historyclassification/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const historyClassification = this._system.historyClassification()
                const id = request.params.id
                historyClassification.deleteHistoryClassificationbyId(id)
                await this._system.commitTransaction()
                response.json({ status: "OK" })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })
    }
}