import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Horse} from "../Horse/Horse";
import {People} from "../Peoples/People";
import {Human} from "../Peoples/Human";

@Entity()
export class Location {
    static readonly ERROR_NAME_BLANK = "Name can not be blank"
    static readonly ERROR_ADDRESS_BLANK = "Address can not be blank"
    static readonly ERROR_PHONE_NUMBER_BLANK = "Phone number can not be black"

    @PrimaryGeneratedColumn()
    private _id: number
    @Column("text")
    private _name: string;
    @Column("text")
    private _address: string;
    @Column("text")
    private _phoneNumber: string;
    @ManyToOne(()=> People,people => people.locations)
    private _personCharge: People;
    @OneToMany(()=> Horse,horse => horse.location)
    private _horses: Horse[]
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    private _createdDate: Date;
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    private _updatedDate: Date;
    @Column({ type: "boolean", default: false })
    private _deleted: boolean;

    static assertNotEmptyName(name: string) {
        if (name.length === 0)
            throw new Error(this.ERROR_NAME_BLANK)
    }

    static assertNotEmptyAddress(address: string) {
        if (address.length === 0)
            throw new Error(this.ERROR_ADDRESS_BLANK)
    }

    static assertNotEmptyPhoneNumber(phoneNumber: string) {
        if (phoneNumber.length === 0)
            throw new Error(this.ERROR_PHONE_NUMBER_BLANK)
    }

    static initialize(name: string, address: string, phoneNumber: string, personCharge: People) {
        this.assertNotEmptyName(name)
        this.assertNotEmptyAddress(address)
        this.assertNotEmptyPhoneNumber(address)

        return new this(name, address, phoneNumber, personCharge)
    }

    constructor(name: string, address: string, phoneNumber: string, personCharge: People) {
        this._name = name
        this._address = address
        this._phoneNumber = phoneNumber
        this._personCharge = personCharge
    }

    get horses(): Horse[] {
        return this._horses
    }

    get id(): number {
        return this._id
    }

    get name(): string {
        return this._name;
    }

    get address(): string {
        return this._address;
    }

    get phoneNumber(): string {
        return this._phoneNumber
    }

    get personCharge(): People {
        return this._personCharge
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

    setName(newName: string) {
        this._name = newName
    }

    setAdress(newAdress: string) {
        this._address = newAdress
    }

    setPhoneNumber(newPhoneNumber: string) {
        this._phoneNumber = newPhoneNumber
    }

    setPersonCharge(newPersonCharge: People) {
        this._personCharge = newPersonCharge
    }


    isEquals(placeToCompare: Location) {
        return this.name === placeToCompare.name && this.address === placeToCompare.address
    }

    nameIs(locationName: string){
        return this.name === locationName
    }

    addressIs(address: string){
        return this.address === address
    }

    phoneNumberIs(phoneNumber: string): boolean {
        return this.phoneNumber === phoneNumber
    }

    personChargeIs(personCharge: Human) {
        return this.personCharge.isEqual(personCharge)
    }

    toJSON()
    {
        return {
            "id": this.id,
            "name": this.name,
            "address": this.address,
            "phoneNumber":this.phoneNumber,
            "personCharge": this.personCharge,
        }
    }
}