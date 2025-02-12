import { ClasificationName } from "../ValuesList/ValueList";
import { Horse } from "../Horse/Horse";
import { HistoryClassification } from "./HistoryClassification";
import { HistoryClassifications } from "./HistoryClassifications";


export class TransientHistoryClassification extends HistoryClassifications {
    clinicHistoryPDF(horseId: number) {
        throw new Error("Method not implemented.");
    }
    inActivityMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    performanceMothersMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    performanceRecipientMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    getAllStock(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]> {
        throw new Error("Method not implemented.");
    }
    deleteHistoryClassificationbyId(ClassificationId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getHistoryClassificationbyId(ClassificationId: number, failedClosure: () => void): Promise<HistoryClassification> {
        throw new Error("Method not implemented.");
    }
    update(ClassificationId: number, date: Date, relatedHorseId: number, comment: string): Promise<HistoryClassification> {
        throw new Error("Method not implemented.");
    }
    findLastClasificationByHorseId(horseId: number): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    findByHorseId(horseId: number): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    
    changeStatus(actualStatus: number, nextStatus: number, idHorse: number, idRelatedHorse: number, comment: string, date: Date, stock: number): Promise<HistoryClassification> {
        throw new Error("Method not implemented.");
    }
    possibleNextStatus(horseId: number, actualStatus: number): Promise<any> {
        throw new Error("Method not implemented.");
    }

    add(ClasificationName: number, date: Date, horseId: number, relatedHorseId: number, cycle:number ,comment: string): Promise<HistoryClassification> {
        throw new Error("Method not implemented.");
    }
    
    private _historyClassifications: Map<number, HistoryClassification>
    constructor(historyClassifications: Map<number, HistoryClassification>) {
        super();
        this._historyClassifications = historyClassifications
    }

    get historyClassifications(): Map<number, HistoryClassification> {
        return this._historyClassifications;
    }

    async getAll() {
        return Array.from(this.historyClassifications.values())
    }

    async amounts() {
        return this.historyClassifications.size
    }

    async hasHistoryClassification(historyClassificationToCompare: HistoryClassification) {
        const historyClassifications = Array.from(this.historyClassifications.values())
        return historyClassifications.some((historyClassification) => historyClassification.isEquals(historyClassificationToCompare));
    }
    async hasHistoryClassificationlName(clasificationName: ClasificationName) {
        const historyClassifications = Array.from(this.historyClassifications.values())
        return historyClassifications.some((historyClassification: HistoryClassification) => historyClassification.nameIs(clasificationName));
    }

    findLastCycleAndStatusByHorseId(horseId: number): Promise<HistoryClassification[]> {
        return Promise.resolve([]);
    }

    getLastCycleAndStatusByHorseId(horseId: number): Promise<number> {
        return Promise.resolve(0);
    }

}