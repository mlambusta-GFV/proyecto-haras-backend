import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Horse } from "./Horse";
import { Location } from "../Locations/Location";

@Entity()
export class LocationHorseHistory {
    static ERROR_DATE_EMPTY = "Date can not be empty in location horse history"
    static ERROR_HORSE_EMPTY = "Horse can not be empty in location horse history"
    static ERROR_LOCATION_EMPTY = "Location can not be empty in location horse history"

    @PrimaryGeneratedColumn()
    _id: number
    @ManyToOne(() => Horse, horse => horse._locationsHistory)
    _horse: Horse
    @ManyToOne(() => Location)
    _location: Location
    @Column({ type: "date" })
    _date: Date
    @Column({ type: "date", nullable: true })
    _departureDate: Date

    private static assertDateNotEmpty(date: Date) {
        if (date === null || date === undefined)
            throw new Error(this.ERROR_DATE_EMPTY)
    }

    private static assertHorseNotEmpty(horse: Horse) {
        if (horse === null || horse === undefined)
            throw new Error(this.ERROR_HORSE_EMPTY)
    }

    private static assertLocationNotEmpty(location: Location) {
        if (location === null || location === undefined)
            throw new Error(this.ERROR_LOCATION_EMPTY)
    }

    static createWith(horse: Horse, location: Location, arrivalDate: Date) {
        this.assertHorseNotEmpty(horse)
        this.assertLocationNotEmpty(location)
        this.assertDateNotEmpty(arrivalDate)

        return new this(horse, location, arrivalDate)
    }

    private constructor(horse: Horse, location: Location, date: Date) {
        this._horse = horse;
        this._location = location;
        this._date = date;
    }

    get id() {
        return this._id
    }

    get horse() {
        return this._horse
    }

    get location() {
        return this._location
    }

    get date() {
        return this._date
    }

    get departureDate() {
        return this._departureDate
    }

    setDepartureDate(date: Date) {
        this._departureDate = date
    }

    toJSON() {
        return {
            id: this.id,
            horse: this.horse,
            location: this.location,
            date: this.date,
            departureDate: this.departureDate
        }
    }

    toJSONExport() {
        return {
            "id": this.id,
            "horse": this.horse.name,
            "location": this.location != null ? this.location.name : "",
            "responsible": this.location != null ? this.location.personCharge.firstName +" "+ this.location.personCharge.lastName : "",
            "date": this.date,
            "departureDate": this.departureDate,
            "horseURL": `${process.env.FRONT_SERVER}/backoffice/horses/${this.horse.id}`
        }
    }
}