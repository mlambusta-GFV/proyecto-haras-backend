import { HistoryClassification } from "./HistoryClassification";

export abstract class HistoryClassifications {
    static readonly ERROR_DUPLICATED_CLASSIFICATION = "Can not add duplicated classification"
    static readonly ERROR_CLASSIFICATION_NOT_FOUND = "Classification not found"
    static readonly ERROR_RELATED_HORSE_REQUIRED = "The related horse is required"
    static readonly ERROR_HORSE_NOT_FOUND = "History Classification not found to the selected horse"
    static readonly INCOMPATIBLE_STATUS = "transition between status not allowed"
    static readonly INCORRECT_STOCK = "stock must be greater than zero"
    static readonly PAJUELA = "8";
    static readonly RECEPTORA = "4";
//                                                 e0                           e1       e2    e3    e4     e5    e6   e7   e8   e9    e10     e11      e12   e13    e14   e15  e16   e17  e18
    static readonly STATUS_RELATIOSN = [[1, 7, 8, 9, 12, 13, 15, 17, 18], [0, 2, 3, 16], [0], [10], [11], [0, 6], [0], [0], [0], [0], [0, 5], [0, 5], [0, 14], [], [0, 12],[], [4], [], [0]];
//                                             e0     e1     e2     e3     e4    e5     e6    e7     e8     e9     e10   e11   e12    e13    e14    e15     e16   e17    e18
    static readonly RELATED_HORSE_REQUIRED = [false, false, false, false, true, false, true, false, false, false, true, true, false, false, false, false, false, false, false];
    static readonly STOCK_REQUIRED =         [false, false, true, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false];

    abstract getAll(): Promise<unknown[]>;

    async assertDuplicatedHistoryClassification(newHistoryClassification: HistoryClassification) {
        if (await this.hasHistoryClassification(newHistoryClassification))
            throw new Error(HistoryClassifications.ERROR_DUPLICATED_CLASSIFICATION)
    }

    abstract add(ClasificationName: number, date: Date, horseId: number, relatedHorseId: number, cycle: number, comment: string): Promise<HistoryClassification>;

    abstract update(ClassificationId: number, date: Date, relatedHorseId: number, comment: string): Promise<HistoryClassification>;

    abstract getHistoryClassificationbyId(ClassificationId: number, failedClosure: () => void): Promise<HistoryClassification | void>;

    abstract deleteHistoryClassificationbyId(ClassificationId: number): Promise<void>;

    abstract amounts(): Promise<any>;

    abstract hasHistoryClassification(historyClassificationToCompare: HistoryClassification): Promise<boolean>;

    abstract possibleNextStatus(horseId: number, actualStatus: number, failedClosure: () => void): Promise<any | void>;

    abstract findLastClasificationByHorseId(horseId: number, failedClosure: () => void): Promise<any | void>;

    abstract findByHorseId(horseId: number, failedClosure: () => void): Promise<any | void>;

    abstract changeStatus(actualStatus: number, nextStatus: number, idHorse: number, idRelatedHorse: number, comment: string, date: Date, stock: number, dosis: number, failedClosure: () => void): Promise<any | void>;

    abstract getLastCycleAndStatusByHorseId(horseId: number): Promise<number>;

    abstract findLastCycleAndStatusByHorseId(horseId: number): Promise<HistoryClassification[]>;

    abstract getAllStock(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>

    abstract performanceRecipientMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>

    abstract performanceMothersMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>

    abstract inActivityMares(search: string, filters: any, page: number, limit: number, order: any): Promise<[unknown[], number]>

    abstract clinicHistoryPDF(horseId:number):any
}