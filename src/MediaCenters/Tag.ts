import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {FileHorse} from "./FileHorse";

@Entity()
export class Tag {
    static readonly ERROR_EMPTY_TAG_NAME = 'Tag name can not be empty';

    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _name: string;

    private static assertNotEmptyName(name: string) {
        if (name.trim().length === 0) throw new Error(Tag.ERROR_EMPTY_TAG_NAME)
    }

    static named(name: string) {
        this.assertNotEmptyName(name)

        return new this(name)
    }

    private constructor(name: string) {
        this._name = name;
    }

    get name() {
        return this._name
    }

    hasName(tagName: string): boolean{
        return this.name === tagName
    }

    isEqual(tagToCompare: Tag): boolean{
        return this.hasName(tagToCompare.name)
    }

    sync(newTag:Tag) {
        this._name = newTag.name
    }

    static readonly EMPTY_TAG = new Tag('')
}