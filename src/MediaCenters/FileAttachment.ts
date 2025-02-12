import {ChildEntity, ManyToOne} from "typeorm";
import {Interventions} from "../ClinicHistory/Interventions";
import {FileGeneric} from "./FileGeneric";
import {FileType} from "../ValuesList/ValueList";

@ChildEntity()
export class FileAttachment extends FileGeneric{
    private static ERROR_FILE_INTERVENTION_EMPTY = 'Intervention can not be empty';

    @ManyToOne(() => Interventions,intervention => intervention._filesAttachment)
    _intervention: Interventions

    get intervention(){
        return this._intervention
    }

    protected static assertInterventionNotEmpty(intervention: Interventions){
        if(intervention === null || intervention === undefined) throw new Error( FileAttachment.ERROR_FILE_INTERVENTION_EMPTY)
    }

    static createAttachment(directory: string, nameFile: string, description: string, fileType: FileType, intervention: Interventions) {
        this.assertInterventionNotEmpty(intervention)
        nameFile = this.addDateToNameFile(nameFile)

        return new this(directory, nameFile, description, fileType, intervention)
    }

    constructor(directory: string, nameFile: string, description: string, fileType: FileType, intervention: Interventions) {
        super(directory, nameFile, description, fileType)

        this._intervention = intervention
    }


    toJSON(): any {
        {
            return {
                id: this.id,
                url: `${process.env.SERVER}/mediacenter/${this.id}`,
                description: this.description,
                nameFile: this.nameFile
            }
        }
    }
}