import {TestBucket} from "./TestBucket";
import {HarasSystem} from "../src/HarasSystem";
import {Locations} from "../src/Locations/Locations";
import {Horses} from "../src/Horse/Horses";
import {Peoples} from "../src/Peoples/Peoples";
import {createConnection} from "typeorm";
import {PersistentHarasSystem} from "../PersistentHarasSystem";
import {FileSystemMediaCenter} from "../src/MediaCenters/FileSystemMediaCenter";
import {TransientHarasSystem} from "../src/TransientHarasSystem";
import {Tag} from "../src/MediaCenters/Tag";

const chai = require("chai")
const expect = chai.expect
const assert = require("assert");
chai.use(require("chai-as-promised"))

describe("Media Center", ()=> {
    const testBucket = new TestBucket()
    let system: HarasSystem = null
    let locations: Locations = null
    let horses: Horses = null
    let peoples: Peoples = null

    beforeEach(async ()=>{
        const host = process.env.TESTING_TYPEORM_HOST
        const port = parseInt(process.env["TESTING_TYPEORM_PORT"])
        const type = process.env["TESTING_TYPEORM_CONNECTION"]
        const username = process.env.TESTING_TYPEORM_USERNAME
        const database = process.env["TESTING_TYPEORM_DATABASE"]
        const password = process.env["TESTING_TYPEORM_PASSWORD"]
        const synchronize = process.env["TESTING_TYPEORM_SYNCHRONIZE"]
        const dropSchema = process.env["TESTING_TYPEORM_DROP_SCHEMA"]

        await createConnection({
                     type: "mysql",
                     host: host,
                     port: 3306,
                     username: "haras",
                     password: "123456",
                     database: "haras_test",
                     entities: ["src/**/*.ts"],
                     synchronize: true,
                     dropSchema: true,
                      logging:true
                 })
        system = new PersistentHarasSystem()

        //system = new TransientHarasSystem()
        await system.start()
        await system.beginTransaction()
        locations = system.locations()
        horses = system.horses()
        peoples = system.peoples()
    });

    afterEach(async ()=>{
        await system.commitTransaction()
        await system.stop()
    });

    it("Can add new file in media center",async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)

        const tornado = await horses.add(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, "fur", null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)

        const mediaCenter = system.mediaCenter()
        await mediaCenter.addHorseFile("prueba.png", description, new ArrayBuffer(8), tornado, [], showInWeb, name, date)

        expect(await mediaCenter.amountFile()).to.eq(1)
        expect(await mediaCenter.amountFileOfHorse(tornado)).to.eq(1)
        expect(await mediaCenter.hasFileWithName("prueba.png")).to.ok
    });

    it("Can not add same file twice in media center",async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const tornado = await horses.add(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, "fur", null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)

        const mediaCenter = system.mediaCenter()
        await mediaCenter.addHorseFile("prueba.png", description, new ArrayBuffer(8), tornado, [], showInWeb, name, date)

        await expect(mediaCenter.addHorseFile("prueba.png", description, new ArrayBuffer(8), tornado, [], showInWeb, name, date))
            .to.be.rejectedWith(Error, FileSystemMediaCenter.ERROR_CAN_NOT_ADD_DUPLICATED_FILE)
        expect(await mediaCenter.amountFile()).to.eq(1)
        expect(await mediaCenter.amountFileOfHorse(tornado)).to.eq(1)
        expect(await mediaCenter.hasFileWithName("prueba.png")).to.ok
    });

    it("Can add many files in media center",async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const tornado = await horses.add(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, "fur", null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)

        const mediaCenter = system.mediaCenter()
        await mediaCenter.addHorseFile("prueba.png", description, new ArrayBuffer(8), tornado, [], showInWeb, name, date)
        await mediaCenter.addHorseFile("prueba2.png", description, new ArrayBuffer(8), tornado, [], showInWeb, name, date)

        expect(await mediaCenter.amountFile()).to.eq(2)
        expect(await mediaCenter.amountFileOfHorse(tornado)).to.eq(2)
        expect(await mediaCenter.hasFileWithName("prueba.png")).to.ok
        expect(await mediaCenter.hasFileWithName("prueba2.png")).to.ok
    });

    it("Can add file in different horse",async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const tornado = await horses.add(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, "fur", null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)
        const martinRodriguez = await peoples.addVeterinarian(TestBucket.MARTIN_RODRIGUEZ_FIRST_NAME, TestBucket.MARTIN_RODRIGUEZ_LAST_NAME,
            TestBucket.MARTIN_RODRIGUEZ_DNI, TestBucket.MARTIN_RODRIGUEZ_REGISTRATION_NUMBER)
        const horseRider = await peoples.addPeople("Juan", "Perez", "12345678")
        const fantasma = await horses.add(TestBucket.FANTASMA_NAME, TestBucket.FANTASMA_SEX, tornadoLocation.id, locationDate, TestBucket.FANTASMA_DATE_BIRTH.toString(), martinRodriguez.id, null, null, null, stock, observation, false, null, null, horseRider.id, null, null, clasificationKey, relatedHorseId, status, classificationDate)

        const mediaCenter = system.mediaCenter()
        await mediaCenter.addHorseFile("prueba.png", description, new ArrayBuffer(8), tornado, [], showInWeb, name, date)
        await mediaCenter.addHorseFile("photoFantasma.png", description, new ArrayBuffer(8), fantasma, [], showInWeb, name, date)

        expect(await mediaCenter.amountFile()).to.eq(2)
        expect(await mediaCenter.amountFileOfHorse(tornado)).to.eq(1)
        expect(await mediaCenter.amountFileOfHorse(fantasma)).to.eq(1)
        expect(await mediaCenter.hasFileWithName("prueba.png")).to.ok
        expect(await mediaCenter.hasFileWithName("photoFantasma.png")).to.ok
    });

    it("Can add file without tag",async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)

        const tornado = await horses.add(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, "fur", null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)

        const mediaCenter = system.mediaCenter()
        await mediaCenter.addHorseFile("prueba.png", description, new ArrayBuffer(8), tornado, [], showInWeb, name, date)

        expect(await mediaCenter.amountFile()).to.eq(1)
        expect(await mediaCenter.amountFileOfHorse(tornado)).to.eq(1)
        expect(await mediaCenter.hasFileWithName("prueba.png")).to.ok
        expect(await tornado.hasTag()).to.false
    });

    it("Can add file with one tag",async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)

        const tornado = await horses.add(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, tornadoLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, "fur", null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)

        const mediaCenter = system.mediaCenter()
        const tag1 = await mediaCenter.addTag(Tag.named("Tag1"))
        await mediaCenter.addHorseFile("prueba.png", description, new ArrayBuffer(8), tornado, [tag1], showInWeb, name, date)

        expect(await mediaCenter.amountFile()).to.eq(1)
        expect(await mediaCenter.amountFileOfHorse(tornado)).to.eq(1)
        expect(await mediaCenter.hasFileWithName("prueba.png")).to.ok
        expect(await mediaCenter.amountFilesWithTag(tag1)).to.eq(1)
        expect(await tornado.hasThisTag(tag1)).to.ok
    });
})