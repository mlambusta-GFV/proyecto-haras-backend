import {Horse} from "../src/Horse/Horse";
import {Location} from "../src/Locations/Location";
import {TestBucket} from "./TestBucket";
import {People} from "../src/Peoples/People";
import {FileHorse} from "../src/MediaCenters/FileHorse";
import {FileType, Sex} from "../src/ValuesList/ValueList";

const chai = require("chai")
const expect = chai.expect
const assert = require("assert");

describe("Horse Test", ()=> {
    const testBucket = new TestBucket()

    it("Can create horse only with required fields", function() {
        const luisGonzalez = People.named(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI, TestBucket.LUIS_GANZALEZ_USER_MANAGER_ID, TestBucket.LUIS_GANZALEZ_EMAIL)
        const tornadoLocation = Location.initialize(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const tornado = Horse.named(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation, locationDate, null, null, null, null, null, observation, false, stock, null, null, null, status)

        expect(tornado.nameIs(TestBucket.TORNADO_NAME)).to.ok
        expect(tornado.locationIs(tornadoLocation)).to.ok
        expect(tornado.sexIs(TestBucket.TORNADO_SEX)).to.ok
        expect(tornado.showInWeb).to.false
        expect(tornado.hasDateOfBirth()).to.false
        expect(tornado.hasVeterinarian()).to.false
        expect(tornado.hasFur()).to.false
        expect(tornado.hasAAFEFataSheet()).to.false
        expect(tornado.hasPedigree()).to.false
        expect(tornado.hasFather()).to.false
        expect(tornado.hasMother()).to.false
        expect(tornado.hasRider()).to.false
        expect(tornado.hasImageProfile()).to.false
    });

    it("Can create horse with all fields", function() {
        const tornado = testBucket.createTornado()

        testBucket.assertTornado(tornado)
        expect(tornado.hasImageProfile()).to.false
    });

    it("Can create horse with image Profile", function() {
        const tornado = testBucket.createTornado()
        const fileType = FileType.initialize("Photo", "jpg",1,false, "photo")
        const imageProfile = FileHorse.named("directory", "file.jpg", null, fileType, tornado, [])
        tornado.addImageProfile(imageProfile)

        testBucket.assertTornado(tornado)
        expect(tornado.hasImageProfile()).to.ok
        expect(tornado.imageProfileIs(imageProfile)).to.ok
    });

    it("Can delete image Profile from horse", function() {
        const tornado = testBucket.createTornado()
        const fileType = FileType.initialize("Photo", "jpg",1,false, "photo")
        const imageProfile = FileHorse.named("directory", "file.jpg", null, fileType, tornado, [])
        tornado.addImageProfile(imageProfile)
        tornado.deleteImageProfile()

        testBucket.assertTornado(tornado)
        expect(tornado.hasImageProfile()).to.false
    });

    it("Can not create horse whiteout name", function() {
        const luisGonzalez = People.named(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI, TestBucket.LUIS_GANZALEZ_USER_MANAGER_ID, TestBucket.LUIS_GANZALEZ_EMAIL)
        const name = ""
        const dateOfBirth = new Date(2010, 2,9)
        const location = Location.initialize("Haras", "una direccion", "154234553", luisGonzalez)
        const sex = Sex.initialize("Yegua", "Yegua", 1, true, "Yegua description")

        assert.throws(
            ()=> Horse.named(name, sex, location, locationDate, dateOfBirth, TestBucket.TORNADO_VETERINARIAN, null, null, null, observation, false, stock, null, null, null, status),
            Error,
            Horse.ERROR_NAME_BLANK
        )
    });

    it("Can update horse only with required fields", function() {
        const luisGonzalez = People.named(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI, TestBucket.LUIS_GANZALEZ_USER_MANAGER_ID, TestBucket.LUIS_GANZALEZ_EMAIL)
        const tornadoLocation = Location.initialize(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const rider = People.named("Juan", "Perez", "12345678", 1, "rider@gmail.com")
        const tornado = Horse.named(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation, locationDate, null, null, null, null, null, observation, false, stock, null, null, null, status)
        const newTornado = Horse.named(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation, locationDate, TestBucket.TORNADO_DATE_BIRTH, null, null, null, null, observation, false, stock, null, null, rider, status)

        tornado.sync(newTornado)

        expect(tornado.nameIs(TestBucket.TORNADO_NAME)).to.ok
        expect(tornado.locationIs(tornadoLocation)).to.ok
        expect(tornado.sexIs(TestBucket.TORNADO_SEX)).to.ok
        expect(tornado.showInWeb).to.false
        expect(tornado.hasDateOfBirth()).to.true
        expect(tornado.dateOfBirthIs(TestBucket.TORNADO_DATE_BIRTH)).to.ok
        expect(tornado.hasVeterinarian()).to.false
        expect(tornado.hasFur()).to.false
        expect(tornado.hasAAFEFataSheet()).to.false
        expect(tornado.hasPedigree()).to.false
        expect(tornado.hasFather()).to.false
        expect(tornado.hasMother()).to.false
        expect(tornado.hasRider()).to.true
        expect(tornado.riderIs(rider)).to.ok
    });
});
