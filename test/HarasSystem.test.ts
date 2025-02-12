import {TransientLocations} from "../src/Locations/TransientLocations";
import {TestBucket} from "./TestBucket";
import {HarasSystem} from "../src/HarasSystem";
import {TransientHarasSystem} from "../src/TransientHarasSystem";
import {TransientHorses} from "../src/Horse/TransientHorses";
import {PersistentHarasSystem} from "../PersistentHarasSystem";
import {createConnection} from "typeorm";
import {Horses} from "../src/Horse/Horses";
import {Locations} from "../src/Locations/Locations";
import {Peoples} from "../src/Peoples/Peoples";
import {PersistentHorses} from "../src/Horse/PersistentHorses";
import {ValuesLists} from "../src/ValuesList/ValuesLists";
import {Horse} from "../src/Horse/Horse";
const assert = require("assert");
const chai = require("chai")
const expect = chai.expect
chai.use(require("chai-as-promised"))

describe("Haras system", ()=> {
    const testBucket = new TestBucket()
    let system: HarasSystem = null
    let locations: Locations = null
    let horses: Horses = null
    let peoples: Peoples = null
    let valuesLists: ValuesLists = null

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
            host: process.env["TESTING_TYPEORM_HOST "],
            port: 3306,
            username: "haras",
            password: "123456",
            database: "haras_test",
            entities: ["src/**/*.ts"],
            synchronize: true,
            dropSchema: true,
            logging: false
        })

        system = new PersistentHarasSystem()
        //system = new TransientHarasSystem()
        await system.start()
        await system.beginTransaction()
        locations = system.locations()
        horses = system.horses()
        peoples = system.peoples()
        valuesLists = system.valuesLists()
    });

    afterEach(async ()=>{
        await system.commitTransaction()
        await system.stop()
    });

    it("Can add one location",async ()=> {
        const haras = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, TestBucket.LUIS_GOZALEZ_PEOPLE)

        expect(await locations.amounts()).to.eq(1)
        testBucket.assertHarasLocation(haras, TestBucket.LUIS_GOZALEZ_PEOPLE)
    });

    it("Can add more than one location", async ()=> {
        const haras = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, TestBucket.LUIS_GOZALEZ_PEOPLE)
        const sanJose = await locations.add(TestBucket.LOCATION_SAN_JOSE_NAME, TestBucket.LOCATION_SAN_JOSE_ADDRES,
            TestBucket.LOCATION_SAN_JOSE_PHONE_NUMBER, TestBucket.MARCELO_FERNADEZ_PEOPLE)

        expect(await locations.amounts()).to.eq(2)
        testBucket.assertHarasLocation(haras, TestBucket.LUIS_GOZALEZ_PEOPLE)
        testBucket.assertSanJoseLocation(sanJose, TestBucket.MARCELO_FERNADEZ_PEOPLE)
    });

    it("Can not add duplicated location", async ()=> {
        const haras = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, TestBucket.LUIS_GOZALEZ_PEOPLE)
        await expect(locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, TestBucket.LUIS_GOZALEZ_PEOPLE))
            .to.be.rejectedWith(Error, TransientLocations.ERROR_DUPLICATED_LOCATION)

        expect(await locations.amounts()).to.eq(1)
        testBucket.assertHarasLocation(haras, TestBucket.LUIS_GOZALEZ_PEOPLE)
    });

    it("Can add one horse",async ()=> {
        await TestBucket.addFursToSystem(system)
        await TestBucket.addSexesToSystem(system)
        await TestBucket.addPeoplesToSystem(system)
        await TestBucket.addVeterinarianToSystem(system)
        await TestBucket.addLocationsToSystem(system)


        // @ts-ignore
        const tornado = await horses.add(TestBucket.TORNADO_NAME, tornadoSex.id, tornadoLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, fur.id, null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)

        expect(await horses.amount()).to.eq(1)
        expect(await horses.hasHorseNamed(TestBucket.TORNADO_NAME)).to.ok
        expect(tornado.nameIs(TestBucket.TORNADO_NAME)).to.ok
        expect(tornado.sexIs(TestBucket.TORNADO_SEX)).to.ok
        expect(tornado.locationIs(TestBucket.TORNADO_LOCATION)).to.ok
        expect(tornado.dateOfBirthIs(TestBucket.TORNADO_DATE_BIRTH)).to.ok
        expect(tornado.veterinarianIs(TestBucket.TORNADO_VETERINARIAN)).to.ok
        expect(tornado.hasFur()).to.ok
        expect(tornado.furIs(TestBucket.TORNADO_FUR)).to.ok
    });

    /*
    it('Can add many horse', async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const padrillo = await valuesLists.addSex('Padrillo', 'Padrillo',1,true, 'Padrillo')
        const tornadoFur = await valuesLists.addFur('Tornado_fur', 'Fur Tornado',1,true, ' fur tornado ')
        const tornado = await horses.add(TestBucket.TORNADO_NAME, padrillo.id, tornadoLocation.id, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id,
            tornadoFur.id, null, null, false, null, null, null, null, null)
        const martinRodriguez = await peoples.addVeterinarian(TestBucket.MARTIN_RODRIGUEZ_FIRST_NAME, TestBucket.MARTIN_RODRIGUEZ_LAST_NAME,
            TestBucket.MARTIN_RODRIGUEZ_DNI, TestBucket.MARTIN_RODRIGUEZ_REGISTRATION_NUMBER)
        const fantasmaSex = padrillo
        const fantasmaFur = await valuesLists.addFur('Fantasma_fur', 'Fur fantasma',1,true, ' fur fantasma ')

        const fantasma = await horses.add(TestBucket.FANTASMA_NAME, fantasmaSex.id, tornadoLocation.id, TestBucket.FANTASMA_DATE_BIRTH.toString(), martinRodriguez.id,
            fantasmaFur.id, null, null, false, null, null, null, null, null)

        expect(await horses.amount()).to.eq(2)
        expect(await horses.hasHorseNamed(TestBucket.TORNADO_NAME)).to.ok
        expect(await horses.hasHorseNamed(TestBucket.FANTASMA_NAME)).to.ok

        await testBucket.assertTornado(system, tornado);
        await testBucket.assertFantasma(system, fantasma)
    });

    it('Can add horse with all field', async ()=> {
        let aafeFataSheet = 'AAFEFataSheet';
        let pedigree = 'pedigree';
        let showInWeb = false;
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const padrillo = await valuesLists.addSex('Padrillo', 'Padrillo',1,true, 'Padrillo')
        const tornadoFur = await valuesLists.addFur('Tornado_fur', 'Fur Tornado',1,true, ' fur tornado ')

        const tornado = await horses.add(TestBucket.TORNADO_NAME, padrillo.id, tornadoLocation.id, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id,
            tornadoFur.id, null, null, false, null, null, null, null, null)

        const yegua = await valuesLists.addSex('Yegua', 'Yegua',1,true, 'Yegua')
        const mother = await horses.add('mother', yegua.id, tornadoLocation.id, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id,
            tornadoFur.id, null, null, false, null, null, null, null, null)
        const martinRodriguez = await peoples.addVeterinarian(TestBucket.MARTIN_RODRIGUEZ_FIRST_NAME, TestBucket.MARTIN_RODRIGUEZ_LAST_NAME,
            TestBucket.MARTIN_RODRIGUEZ_DNI, TestBucket.MARTIN_RODRIGUEZ_REGISTRATION_NUMBER)
        const horseRider = await peoples.addPeople('Juan', 'Perez', '12345678')
        const fantasmaSex = padrillo
        const fantasmaFur = await valuesLists.addFur('Fantasma_fur', 'Fur fantasma',1,true, ' fur fantasma ')

        const fantasma = await horses.add(TestBucket.FANTASMA_NAME, fantasmaSex.id, tornadoLocation.id, TestBucket.FANTASMA_DATE_BIRTH.toString(),
            martinRodriguez.id, fantasmaFur.id, aafeFataSheet, pedigree, showInWeb, tornado.id, mother.id, horseRider.id, null, null)

        expect(await horses.amount()).to.eq(3)

        expect(fantasma.nameIs(TestBucket.FANTASMA_NAME)).to.ok
        expect(fantasma.dateOfBirthIs(TestBucket.FANTASMA_DATE_BIRTH)).to.ok
        expect(fantasma.locationIs(tornadoLocation)).to.ok
        expect(fantasma.sexIs(TestBucket.FANTASMA_SEX)).to.ok
        expect(fantasma.veterinarianIs(TestBucket.FANTASMA_VETERINARIAN)).to.ok
        expect(fantasma.hasFur()).to.ok
        expect(fantasma.furIs(fantasmaFur)).to.ok
        expect(fantasma.hasAAFEFataSheet()).to.ok
        expect(fantasma.AAFEFataSheetIs(aafeFataSheet)).to.ok
        expect(fantasma.hasPedigree()).to.ok
        expect(fantasma.pedigreeIs(pedigree)).to.ok
        expect(fantasma.hasFather()).to.true
        expect(fantasma.fatherIs(tornado)).to.ok
        expect(fantasma.hasMother()).to.true
        expect(fantasma.motherIs(mother)).to.ok
        expect(fantasma.hasRider()).to.true
        expect(fantasma.riderIs(horseRider)).to.ok
    });

    it('Can not add duplicated horse', async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI, )
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const tornadoSex = await valuesLists.addSex('Padrillo', 'Padrillo',1,true, 'Padrillo')
        const tornadoFur = await valuesLists.addFur('Tornado_fur', 'Fur Tornado',1,true, ' fur tornado ')

        const tornado = await horses.add(TestBucket.TORNADO_NAME, tornadoSex.id, tornadoLocation.id, TestBucket.TORNADO_DATE_BIRTH.toString(),
            veterinarian.id, tornadoFur.id, null, null, false, null, null, null, null, null)

        await expect(horses.add(TestBucket.TORNADO_NAME, tornadoSex.id, tornadoLocation.id, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id,
            tornadoFur.id, null, null, false, null, null, null, null, null))
            .to.be.rejectedWith(Error, TransientHorses.ERROR_CAN_NOT_ADD_DUPLICATED_HORSE)

        expect(await horses.amount()).to.eq(1)
        expect(await horses.hasHorseNamed(TestBucket.TORNADO_NAME)).to.ok

        await testBucket.assertTornado(system, tornado);
    });

    it('Can update horse',async ()=> {
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const tornadoSex = await valuesLists.addSex('Padrillo', 'Padrillo',1,true, 'Padrillo')
        const tornadoFur = await valuesLists.addFur('Tornado_fur', 'Fur Tornado',1,true, ' fur tornado ')

        const tornado = await horses.add(TestBucket.TORNADO_NAME, tornadoSex.id, tornadoLocation.id, TestBucket.TORNADO_DATE_BIRTH.toString(),
            veterinarian.id, tornadoFur.id, null, null, false, null, null, null, null, null)
        const newVeterinarian = await peoples.addVeterinarian('Roberto', 'Sanchez',
            '2314568', '333333')
        const newTornado = await horses.update(tornado.id, TestBucket.TORNADO_NAME, tornadoSex.id, tornadoLocation.id,
            TestBucket.TORNADO_DATE_BIRTH, newVeterinarian.id, null, null, null, false,
            null, null, null,  null, null)

        expect(await horses.amount()).to.eq(1)
        expect(await horses.hasHorseNamed(TestBucket.TORNADO_NAME)).to.ok
        expect(newTornado.nameIs(TestBucket.TORNADO_NAME)).to.ok
        expect(newTornado.dateOfBirthIs(TestBucket.TORNADO_DATE_BIRTH)).to.ok
        expect(newTornado.locationIs(tornadoLocation)).to.ok
        expect(newTornado.sexIs(TestBucket.TORNADO_SEX)).to.ok
        expect(newTornado.veterinarianIs(newVeterinarian)).to.ok
    });

    it('Can add one veterinarian', async ()=> {
        const peoples = system.peoples()

        const juanPerez = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)

        expect(await  peoples.amount()).to.eq(1)
        testBucket.assertJuanPerezVeterinarian(juanPerez)
    });

    it('Can add many veterinarian', async ()=> {
        const peoples = system.peoples()

        const juanPerez = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const marinRodriguez = await peoples.addVeterinarian(TestBucket.MARTIN_RODRIGUEZ_FIRST_NAME, TestBucket.MARTIN_RODRIGUEZ_LAST_NAME,
            TestBucket.MARTIN_RODRIGUEZ_DNI, TestBucket.MARTIN_RODRIGUEZ_REGISTRATION_NUMBER)

        expect(await  peoples.amount()).to.eq(2)
        testBucket.assertJuanPerezVeterinarian(juanPerez)
        testBucket.assertMartinRodriguezVeterinarian(marinRodriguez)
    });

    it('Can not add duplicated veterinarian', async ()=> {
        const juanPerez = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)

        await expect(peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER))
            .to.be.rejectedWith(Error, Peoples.ERROR_CAN_NOT_ADD_DUPLICATED_PEOPLES)
        expect(await  peoples.amount()).to.eq(1)
        testBucket.assertJuanPerezVeterinarian(juanPerez)
    });

    it('Can add image profile to the horse',async ()=> {
        await valuesLists.addFileType('PHOTO', 'png,jeg', 1, false, 'photo' )
        const tornadoSex = await valuesLists.addSex('Padrillo', 'Padrillo',1,true, 'Padrillo')
        const tornadoFur = await valuesLists.addFur('Tornado_fur', 'Fur Tornado',1,true, ' fur tornado ')
        await system.commitTransaction()
        await system.beginTransaction()
        const luisGonzalez = await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI)
        const tornadoLocation = await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
        const veterinarian = await peoples.addVeterinarian(TestBucket.JUAN_PEREZ_FIRST_NAME, TestBucket.JUAN_PEREZ_LAST_NAME,
            TestBucket.JUAN_PEREZ_DNI, TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)
        const tornado = await horses.add(TestBucket.TORNADO_NAME, tornadoSex.id, tornadoLocation.id, TestBucket.TORNADO_DATE_BIRTH.toString(),
            veterinarian.id, tornadoFur.id, null, null, false, null, null, null,
            null, null)

        const fileName = 'prueba.png'
        const fileData = await horses.addImageProfile(tornado.id, fileName, new ArrayBuffer(8))

        expect(await horses.amount()).to.eq(1)
        expect(await horses.hasHorseNamed(TestBucket.TORNADO_NAME)).to.ok
        await testBucket.assertTornado(system, tornado);
        expect(await horses.hasImageProfile(tornado.id)).to.true
    });

     */
})

