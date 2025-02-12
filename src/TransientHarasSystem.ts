import { Location } from "./Locations/Location";
import { TransientLocations } from "./Locations/TransientLocations";
import { HarasSystem } from "./HarasSystem";
import { TransientHorses } from "./Horse/TransientHorses";
import { Horse } from "./Horse/Horse";
import { Horses } from "./Horse/Horses";
import { Peoples } from "./Peoples/Peoples";
import { TransientPeoples } from "./Peoples/TransientPeoples";
import { Human } from "./Peoples/Human";
import { Locations } from "./Locations/Locations";
import { TransientMediaCenter } from "./MediaCenters/TransientMediaCenter";
import { MediaCenter } from "./MediaCenters/MediaCenter";
import { Document } from "./Documents/Document";
import { Documents } from "./Documents/Documents";
import { TransientDocuments } from "./Documents/TransientDocuments";
import { ValueList } from "./ValuesList/ValueList";
import { ValuesLists } from "./ValuesList/ValuesLists";
import { TransientValueList } from "./ValuesList/TransientValueList";
import { ClinicHistory } from "./ClinicHistory/ClinicHistory";
import { HistoryClassification } from "./HistoryClassification/HistoryClassification";
import { HistoryClassifications } from "./HistoryClassification/HistoryClassifications";
import { TransientHistoryClassification } from "./HistoryClassification/TransientHistoryClassification";
import { Post } from "./Posts/Post";
import { Posts } from "./Posts/Posts";
import { TransientPost } from "./Posts/TransientPost";
import { Task } from "./Tasks/Task";
import { Tasks } from "./Tasks/Tasks";
import { TransientTasks } from "./Tasks/TransientTasks";

export class TransientHarasSystem implements HarasSystem {
    private _locations: Map<number, Location>
    private _horses: Map<number, Horse>
    private _peoples: Array<Human>
    private _documents: Map<number, Document>
    private _valuesLists: Map<number, ValueList>
    private _historyClassifications: Map<number, HistoryClassification>
    private _posts: Map<number, Post>
    private _tasks: Map<number, Task>

    constructor() {
        this._locations = new Map()
        this._horses = new Map<number, Horse>()
        this._peoples = new Array<Human>()
        this._documents = new Map()
        this._valuesLists = new Map()
        this._historyClassifications = new Map()
        this._posts = new Map()
        this._tasks = new Map()
    }
    sync(): Promise<void> {
        return Promise.resolve(undefined);
    }

    tasks(): Tasks {
        return new TransientTasks()
    }

    beginTransaction(): Promise<void> {
        return Promise.resolve(undefined);
    }

    commitTransaction(): Promise<void> {
        return Promise.resolve(undefined);
    }

    reset(): void {
    }

    rollbackTransaction(): Promise<void> {
        return Promise.resolve(undefined);
    }

    start(): Promise<void> {
        return Promise.resolve(undefined);
    }

    stop(): Promise<void> {
        return Promise.resolve(undefined);
    }

    horses(): Horses {
        return new TransientHorses(this._horses, new TransientLocations(this._locations), this.peoples(), this.valuesLists())
    }

    locations(): Locations {
        return new TransientLocations(this._locations)
    }

    peoples(): Peoples {
        return new TransientPeoples(this._peoples);
    }

    mediaCenter(): MediaCenter {
        return new TransientMediaCenter(this.horses());
    }

    documents(): Documents {
        return new TransientDocuments(this._documents)
    }

    valuesLists(): ValuesLists {
        return new TransientValueList(this._valuesLists)
    }

    posts(): Posts {
        return new TransientPost()
    }

    clinicHistory(): ClinicHistory {
        return null
    }

    historyClassification(): HistoryClassifications {
        return new TransientHistoryClassification(this._historyClassifications)
    }
}