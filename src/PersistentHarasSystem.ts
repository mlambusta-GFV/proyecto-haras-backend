import { Connection, createConnection, getConnection, QueryRunner } from "typeorm";
import { PersistentLocations } from "./Locations/PersistentLocations";
import { HarasSystem } from "./HarasSystem";
import { PersistentHorses } from "./Horse/PersistentHorses";
import { Horses } from "./Horse/Horses";
import { Locations } from "./Locations/Locations";
import { ValuesLists } from "./ValuesList/ValuesLists";
import { PersistentPeoples } from "./Peoples/PersistentPeoples";
import { Peoples } from "./Peoples/Peoples";
import { FileSystemMediaCenter } from "./MediaCenters/FileSystemMediaCenter";
import { MediaCenter } from "./MediaCenters/MediaCenter";
import { PersistentClinicHistory } from "./ClinicHistory/PersistentClinicHistory";
import { Documents } from "./Documents/Documents";
import { PersistentDocuments } from "./Documents/PersistentDocuments";
import { PersistentValueList } from "./ValuesList/PersistentValueList";
import { Posts } from "./Posts/Posts";
import { PersistentPost } from "./Posts/persistentPost";
import { Tasks } from "./Tasks/Tasks";
import { PersistentTasks } from "./Tasks/PersistentTasks";
import { HistoryClassifications } from "./HistoryClassification/HistoryClassifications";
import { PersistentHistoryClassification } from "./HistoryClassification/PersistentHistoryClassification";

export class PersistentHarasSystem implements HarasSystem {
    private _queryRunner: QueryRunner;
    private _connection: Connection;
    private _locations: Locations
    private _horses: Horses
    private _peoples: Peoples
    private _mediaCenter: FileSystemMediaCenter;
    private _clinicHistory: PersistentClinicHistory;
    private _documents: Documents;
    private _valuesList: ValuesLists;
    private _post: Posts;
    private _historyClassifications: HistoryClassifications;
    private _tasks: Tasks;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
    }

    async start(): Promise<void> {
        this._connection = getConnection()
        this._queryRunner = this._connection.createQueryRunner();
        this._locations = new PersistentLocations(this._queryRunner);
        this._peoples = new PersistentPeoples(this._queryRunner)
        this._valuesList = new PersistentValueList(this._queryRunner);
        this._post = new PersistentPost(this._queryRunner, this._horses, this._valuesList);
        this._horses = new PersistentHorses(this._queryRunner, this.locations(), this.peoples(), this.valuesLists());
        this._mediaCenter = new FileSystemMediaCenter(this._queryRunner, __dirname + `/${process.env.DIRECTORY_HORSE}/`,
            this._horses, this.valuesLists(), this.locations(), this.peoples())
        this._documents = new PersistentDocuments(this._queryRunner);
        this._horses.addStore(this._mediaCenter);
        this._clinicHistory = new PersistentClinicHistory(this._queryRunner, this.horses(), this.peoples(),
            this.valuesLists(), this.mediaCenter());
        this._tasks = new PersistentTasks(this._queryRunner, this._horses, this._valuesList, this._peoples);
        this._historyClassifications = new PersistentHistoryClassification(this._queryRunner, this._valuesList, this._horses, this._clinicHistory);
        this._horses.addHistoryClassification(this._historyClassifications);
    }

    async stop(): Promise<void> {
        await this._connection.close()
    }

    async sync(): Promise<void> {
        if (this._connection.isConnected){
            this._connection = getConnection()
            this._queryRunner = this._connection.createQueryRunner();
        }
        else{
            (await createConnection()).connect
            this._connection = getConnection()
            this._queryRunner = this._connection.createQueryRunner();
        }
    }

    async beginTransaction(): Promise<void> {
        await this._queryRunner.startTransaction();
    }

    async commitTransaction(): Promise<void> {
        if (this._queryRunner.isTransactionActive) {
            await this._queryRunner.commitTransaction();
        }
    }

    async rollbackTransaction(): Promise<void> {
        if (this._queryRunner.isTransactionActive) {
            await this._queryRunner.rollbackTransaction();
        }
    }

    reset(): void {
        this._queryRunner = null
    }

    clinicHistory(): PersistentClinicHistory {
        return this._clinicHistory
    }

    locations(): Locations {
        return this._locations
    }

    valuesLists(): ValuesLists {
        return this._valuesList
    }

    horses(): Horses {
        return this._horses
    }

    peoples(): Peoples {
        return this._peoples;
    }

    mediaCenter(): MediaCenter {
        return this._mediaCenter
    }

    documents(): Documents {
        return this._documents
    }

    historyClassification(): HistoryClassifications {
        return this._historyClassifications
    }

    posts(): Posts {
        return this._post
    }

    tasks(): Tasks {
        return this._tasks
    }
}