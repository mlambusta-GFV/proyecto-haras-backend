import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Horse } from "../Horse/Horse";

@Entity()
export class Document {
    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _documentation: string
    @ManyToOne(() => Horse, horse => horse.documents)
    private _horse: Horse
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({ type: "boolean", default: false })
    private _deleted: boolean;

    static readonly ERROR_DOCUMENTATION_BLANK = 'Documentation can not be blank'

    get id(): number {
        return this._id
    }

    get documentation() {
        return this._documentation
    }

    get horse(): Horse {
        return this._horse
    }

    get createdDate(): Date {
        return this._createdDate
    }

    get updatedDate(): Date {
        return this._updatedDate
    }

    get deleted(): boolean {
        return this._deleted
    }

    setDocumentation(newDocumentation: string) {
        this._documentation = newDocumentation
    }

    setHorse(newHorse: Horse) {
        this._horse = newHorse
    }

    static assertNotEmptyDocumentation(documentation: string) {
        if (documentation.length === 0)
            throw new Error(this.ERROR_DOCUMENTATION_BLANK)
    }

    static initialize(documentation: string, horse: Horse) {
        this.assertNotEmptyDocumentation(documentation)

        return new this(documentation, horse)
    }

    private constructor(documentation: string, horse: Horse) {
        this._documentation = documentation;
        this._horse = horse;
    }

    isEquals(documentToCompare: Document) {
        return this.documentation === documentToCompare.documentation && this.horse === documentToCompare.horse
    }

    documentationIs(documentation: string) {
        return this._documentation === documentation
    }

    hasHorse(horse: Horse): boolean {
        return this.horse.isEqual(horse)
    }

    toJSON(): { id: number, documentation: string, horse: Horse } {
        return {
            "id": this.id,
            "documentation": this.documentation,
            "horse": this.horse,
        }
    }
}