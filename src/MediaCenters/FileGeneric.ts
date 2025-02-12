import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    TableInheritance, UpdateDateColumn
} from "typeorm";
import {FileType} from "../ValuesList/ValueList";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "_type" } })
export abstract class FileGeneric {
    static readonly ERROR_FILE_NAME_EMPTY = 'FileGeneric name can not be empty';

    @PrimaryGeneratedColumn()
    private _id: number
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({ type: "boolean", default: false })
    private _deleted: boolean;
    @Column("text")
    private _directory: string
    @Column("text")
    private _nameFile: string
    @Column({type:"text", nullable: true})
    private _description: string
    @ManyToOne(() => FileType)
    @JoinColumn()
    private _type: FileType

    get id() {
        return this._id
    }

    get description(): string {
        return this._description
    }

    get nameFile(){
        return this._nameFile
    }

    get directory(){
        return this._directory
    }

    get type(){
        return this._type
    }

    get url() {
        return `${process.env.SERVER}/mediacenter/${this.id}`
    }

    protected static addDateToNameFile(nameFile: string): string {
        const today = new Date()
        const dotPosition = nameFile.indexOf(".")
        const extensionName = nameFile.slice(dotPosition)
        const name = nameFile.slice(0,dotPosition).replace(/ /g,'')
        return name + today.getTime() + extensionName
    }

    protected static  assertValidName(nameFile: string) {
        if (nameFile === null || nameFile === undefined) throw new Error(FileGeneric.ERROR_FILE_NAME_EMPTY)
    }

    constructor(directory: string, nameFile: string, description: string,fileType: FileType) {
        this._nameFile = nameFile
        this._directory = directory
        this._type = fileType
        this._description = description
    }

    set description(description: string) {
        this._description = description
    }

    nameIs(fileName: string) {
        return this._nameFile === fileName
    }

    isEqual(fileDataCompare: FileGeneric): boolean {
        return this.nameIs(fileDataCompare.nameFile)
    }

    fullPath(): string {
        return this.directory +  this.nameFile
    }

    delete() {
        return this._deleted = true
    }

    isDeleted(){
        return this._deleted === true
    }

    isImageType(): boolean {
        return this.type.key === 'PHOTO'
    }

    isVideoType(): boolean {
        return this.type.key === 'VIDEO'
    }

    isMovType(){
        return this._nameFile.endsWith(".mov")
    }

    convertNameToWebp() {
        if(this.isImageType()) {
            const extension = this.nameFile.split('.').pop();
            this._nameFile = this.nameFile.replace(extension, 'webp')
        }
    }

    convertNameToMp4() {
        if(this.isVideoType()) {
            const extension = this.nameFile.split('.').pop();
            this._nameFile = this.nameFile.replace(extension, 'mp4')
        }
    }



    abstract toJSON(): any;
}
