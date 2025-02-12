import {LocationsServer} from "./Locations/LocationsServer";
import {HarasSystem} from "./HarasSystem";
import {HorsesServer} from "./Horse/HorsesServer";
import {PeoplesServer} from "./Peoples/PeoplesServer";
import {MediaCenterServer} from "./MediaCenters/MediaCenterServer";
import { DocumentsServer } from "./Documents/DocumentsServer";
import {ValuesListsServer} from "./ValuesList/ValueListServer";
import { HistoryClassificationServer } from "./HistoryClassification/HistoryClassificationServer";
import { PostServer } from "./Posts/PostServer";
import {ClinicHistoryServer} from "./ClinicHistory/ClinicHistoryServer";
import { TaskServer } from "./Tasks/TaskServer";
import { ReportsServer } from "./Reports/ReportsServer";

export class HarasServer{

    constructor(server: any, system: HarasSystem) {
        new LocationsServer(server, system)
        new HorsesServer(server, system)
        new PeoplesServer(server, system)
        new MediaCenterServer(server, system)
        new DocumentsServer(server,system)
        new MediaCenterServer(server, system)
        new ValuesListsServer(server, system)
        new HistoryClassificationServer(server,system)
        new PostServer(server, system)
        new ClinicHistoryServer(server, system)
        new TaskServer(server, system)
        new ReportsServer(server, system)
    }
}