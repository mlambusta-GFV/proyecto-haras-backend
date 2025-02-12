import {Horses} from "./Horse/Horses";
import {Peoples} from "./Peoples/Peoples";
import {Locations} from "./Locations/Locations";
import {MediaCenter} from "./MediaCenters/MediaCenter";
import {Documents} from "./Documents/Documents";
import {ValuesLists} from  "./ValuesList/ValuesLists"
import { Posts } from "./Posts/Posts";
import {ClinicHistory} from "./ClinicHistory/ClinicHistory";
import { HistoryClassifications } from "./HistoryClassification/HistoryClassifications";
import { Tasks } from "./Tasks/Tasks";

export interface HarasSystem {
    start(): Promise<void>;

    stop(): Promise<void>;

    sync(): Promise<void>;
    
    beginTransaction(): Promise<void>;

    commitTransaction(): Promise<void>;

    rollbackTransaction(): Promise<void>;

    reset(): void;

    locations(): Locations;

    horses(): Horses;

    peoples(): Peoples;

    mediaCenter(): MediaCenter;

    clinicHistory(): ClinicHistory;

    documents(): Documents;

    valuesLists(): ValuesLists;

    historyClassification(): HistoryClassifications;
    
    posts():Posts;

    tasks():Tasks;
}