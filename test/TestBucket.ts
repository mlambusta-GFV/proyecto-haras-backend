import {Location} from "../src/Locations/Location";
import {Horse} from "../src/Horse/Horse";
import {Veterinarian} from "../src/Peoples/Veterinarian";
import {Human} from "../src/Peoples/Human";
import {People} from "../src/Peoples/People";
import {HarasSystem} from "../src/HarasSystem";
import {Locations} from "../src/Locations/Locations";
import {Fur, Sex} from "../src/ValuesList/ValueList";
import {ValuesLists} from "../src/ValuesList/ValuesLists";
import {Peoples} from "../src/Peoples/Peoples";

const assert = require("assert");
const chai = require("chai")
const expect = chai.expect

export class TestBucket {
    assertHarasLocation(haras: Location, peopleCharge: Human){
        expect(haras.nameIs(TestBucket.LOCATION_HARAS_NAME)).to.ok
        expect(haras.addressIs(TestBucket.LOCATION_HARAS_ADDRES)).to.ok
        expect(haras.phoneNumberIs(TestBucket.LOCATION_HARAS_PHONE_NUMBER)).to.ok
        expect(haras.personChargeIs(peopleCharge)).to.ok
    }

    public static readonly LOCATION_SAN_JOSE_NAME = "San Jose"
    public static readonly LOCATION_SAN_JOSE_ADDRES = "direccion san jose"
    public static readonly LOCATION_SAN_JOSE_PHONE_NUMBER = "153231553"
    public static readonly LOCATION_SAN_JOSE_PERSON_CHARGE = "Persona Responsable2"

    assertSanJoseLocation(haras: Location, peopleCharge: Human){
        expect(haras.nameIs(TestBucket.LOCATION_SAN_JOSE_NAME)).to.ok
        expect(haras.addressIs(TestBucket.LOCATION_SAN_JOSE_ADDRES)).to.ok
        expect(haras.phoneNumberIs(TestBucket.LOCATION_SAN_JOSE_PHONE_NUMBER)).to.ok
        expect(haras.personChargeIs(peopleCharge)).to.ok
    }

    public static readonly JUAN_PEREZ_FIRST_NAME = "Juan"
    public static readonly JUAN_PEREZ_LAST_NAME = "Perez"
    public static readonly JUAN_PEREZ_DNI = "29543897"
    public static readonly JUAN_PEREZ_REGISTRATION_NUMBER = "12345"
    public static readonly JUAN_PEREZ_USER_MANAGER_ID = 2
    public static readonly JUAN_PEREZ_EMAIL = "jperez@gmail.com"
    public static readonly JUAN_PEREZ_VETERINARIAN = Veterinarian.named(this.JUAN_PEREZ_FIRST_NAME, this.JUAN_PEREZ_LAST_NAME,
        this.JUAN_PEREZ_DNI, this.JUAN_PEREZ_REGISTRATION_NUMBER, this.JUAN_PEREZ_USER_MANAGER_ID, this.JUAN_PEREZ_EMAIL)

    static async addJuanPerezVeterinarianToSystem(system: HarasSystem) {
        const peoples = system.peoples()
        return await peoples.addVeterinarian(this.JUAN_PEREZ_FIRST_NAME, this.JUAN_PEREZ_LAST_NAME,
            this.JUAN_PEREZ_DNI, this.JUAN_PEREZ_REGISTRATION_NUMBER, this.JUAN_PEREZ_USER_MANAGER_ID, this.JUAN_PEREZ_EMAIL)
    }

    static async addVeterinarianToSystem(system: HarasSystem) {
        const peoples = system.peoples()
        await peoples.addVeterinarian(this.JUAN_PEREZ_FIRST_NAME, this.JUAN_PEREZ_LAST_NAME,
            this.JUAN_PEREZ_DNI, this.JUAN_PEREZ_REGISTRATION_NUMBER, this.JUAN_PEREZ_USER_MANAGER_ID, this.JUAN_PEREZ_EMAIL)
    }

    public static readonly MARTIN_RODRIGUEZ_FIRST_NAME = "Martin"
    public static readonly MARTIN_RODRIGUEZ_LAST_NAME = "Rodriguez"
    public static readonly MARTIN_RODRIGUEZ_REGISTRATION_NUMBER = "54321"
    public static readonly MARTIN_RODRIGUEZ_DNI = "37543891"
    public static readonly MARTIN_RODRIGUEZ_USER_MANAGER = 3
    public static readonly MARTIN_RODRIGUEZ_EMAIL = "mrodriguez@gmail.com"
    public static readonly MARTIN_RODRIGUEZ_VETERINARIAN = Veterinarian.named(this.MARTIN_RODRIGUEZ_FIRST_NAME, this.MARTIN_RODRIGUEZ_LAST_NAME,
        this.MARTIN_RODRIGUEZ_DNI, this.MARTIN_RODRIGUEZ_REGISTRATION_NUMBER, this.MARTIN_RODRIGUEZ_USER_MANAGER, this.MARTIN_RODRIGUEZ_EMAIL)

    public static readonly HORSE_BUCKET = "horsebucket"
    public static readonly TORNADO_PHOTO_NAME = "tornado.png"
    public static readonly TORNADO_PHOTO_DATA =  new ArrayBuffer(16)

    public static readonly FANTASMA_NAME = "Fantasma"
    public static readonly FANTASMA_DATE_BIRTH = new Date(2011, 3,11)
    public static readonly FANTASMA_SEX = Sex.initialize("Padrillo", "Padrillo", 1, true, "Padrillo description")
    public static readonly FANTASMA_VETERINARIAN =  TestBucket.MARTIN_RODRIGUEZ_VETERINARIAN
    public static readonly FANTASMA_FUR = Fur.initialize("fur", "fur", 1, true, "fur description");

    assertJuanPerezVeterinarian(veterinarian: Veterinarian){
        expect(veterinarian.firstNameIs(TestBucket.JUAN_PEREZ_FIRST_NAME)).to.ok
        expect(veterinarian.lastNameIs(TestBucket.JUAN_PEREZ_LAST_NAME)).to.ok
        expect(veterinarian.registrationNumberIs(TestBucket.JUAN_PEREZ_REGISTRATION_NUMBER)).to.ok
        expect(veterinarian.dniIs(TestBucket.JUAN_PEREZ_DNI)).to.ok
    }

    assertMartinRodriguezVeterinarian(veterinarian: Veterinarian) {
        expect(veterinarian.firstNameIs(TestBucket.MARTIN_RODRIGUEZ_FIRST_NAME)).to.ok
        expect(veterinarian.lastNameIs(TestBucket.MARTIN_RODRIGUEZ_LAST_NAME)).to.ok
        expect(veterinarian.registrationNumberIs(TestBucket.MARTIN_RODRIGUEZ_REGISTRATION_NUMBER)).to.ok
        expect(veterinarian.dniIs(TestBucket.MARTIN_RODRIGUEZ_DNI)).to.ok
    }

    async assertFantasma(system: HarasSystem, fantasma: Horse) {
        const locations = system.locations()
        const tornadoLocation = await locations.findByName(TestBucket.TORNADO_LOCATION_NAME,
            ()=>{ throw new Error(Locations.ERROR_LOCATION_NOT_FOUND)})

        expect(fantasma.nameIs(TestBucket.FANTASMA_NAME)).to.ok
        expect(fantasma.dateOfBirthIs(TestBucket.FANTASMA_DATE_BIRTH)).to.ok
        // @ts-ignore
        expect(fantasma.locationIs(tornadoLocation)).to.ok
        expect(fantasma.sexIs(TestBucket.FANTASMA_SEX)).to.ok
        expect(fantasma.veterinarianIs(TestBucket.FANTASMA_VETERINARIAN)).to.ok
    }

    public static readonly MARCELO_FERNADEZ_FIRST_NAME = "Marcelo"
    public static readonly MARCELO_FERNADEZ_LAST_NAME = "Fernadez"
    public static readonly MARCELO_FERNADEZ_DNI = "41590012"
    public static readonly MARCELO_FERNADEZ_USER_MANAGER_ID = 5
    public static readonly MARCELO_FERNADEZ_EMAIL = "mfernandez@gmail.com"
    public static readonly MARCELO_FERNADEZ_PEOPLE = People.named(TestBucket.MARCELO_FERNADEZ_FIRST_NAME, TestBucket.MARCELO_FERNADEZ_LAST_NAME,
        TestBucket.MARCELO_FERNADEZ_DNI, TestBucket.MARCELO_FERNADEZ_USER_MANAGER_ID, TestBucket.MARCELO_FERNADEZ_EMAIL)

    public static readonly LOCATION_HARAS_NAME = "Haras"
    public static readonly LOCATION_HARAS_ADDRES = "una direccion"
    public static readonly LOCATION_HARAS_PHONE_NUMBER = "154234553"
    public static readonly LOCATION_HARAS_PERSON_CHARGE = "Persona Responsable"

    public static readonly LUIS_GANZALEZ_FIRST_NAME = "Luis"
    public static readonly LUIS_GANZALEZ_LAST_NAME = "Gonzalez"
    public static readonly LUIS_GANZALEZ_DNI = "40123654"
    public static readonly LUIS_GANZALEZ_USER_MANAGER_ID = 1
    public static readonly LUIS_GANZALEZ_EMAIL = "lgonzalez@gmail.com"
    public static readonly LUIS_GOZALEZ_PEOPLE = People.named(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
        TestBucket.LUIS_GANZALEZ_DNI, TestBucket.LUIS_GANZALEZ_USER_MANAGER_ID, TestBucket.LUIS_GANZALEZ_EMAIL)

    static async addLuisGonzalezToSystem(system: HarasSystem) {
        const peoples = system.peoples()
        return await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI, TestBucket.LUIS_GANZALEZ_USER_MANAGER_ID, TestBucket.LUIS_GANZALEZ_EMAIL)
    }

    static async addTornadoLocationToSystem(system: HarasSystem) {
        const luisGonzalez = await TestBucket.addLuisGonzalezToSystem(system)
        const locations = system.locations()
        return await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
    }

    static createTornadoLocation(){
        const luisGonzalez = this.LUIS_GOZALEZ_PEOPLE
        return Location.initialize(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
    }

    public static readonly SEX_PADRILLO = Sex.initialize("PADRILLO", "padrillo", 1, true, "padrillo description")
    public static readonly SEX_YEGUA = Sex.initialize("Yegua", "Yegua", 1, true, "Yegua description")

    static async addSexesToSystem(system: HarasSystem){
        const valuesList = system.valuesLists()
        await valuesList.addSex("Padrillo", "padrillo", 1, true, "padrillo description")
        await valuesList.addSex("Yegua", "Yegua", 1, true, "Yegua description")
    }

    static async addInterventionTypeToSystem(system: HarasSystem){
        const valuesList = system.valuesLists()
        await valuesList.addInterventionType("INTERVENTION_TYPE", "interfention type", 1, true, "intervention type description")
    }

    static async addPeoplesToSystem(system: HarasSystem){
        const peoples = system.peoples()
        await peoples.addPeople(TestBucket.LUIS_GANZALEZ_FIRST_NAME, TestBucket.LUIS_GANZALEZ_LAST_NAME,
            TestBucket.LUIS_GANZALEZ_DNI, TestBucket.LUIS_GANZALEZ_USER_MANAGER_ID, TestBucket.LUIS_GANZALEZ_EMAIL)
    }

    static async addLocationsToSystem(system: HarasSystem){
        const locations = system.locations()
        const peoples = system.peoples()

        const luisGonzalez = await peoples.findPeopleByDNI(TestBucket.LUIS_GANZALEZ_DNI, () => {
            throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)
        })

        await locations.add(TestBucket.LOCATION_HARAS_NAME, TestBucket.LOCATION_HARAS_ADDRES,
            TestBucket.LOCATION_HARAS_PHONE_NUMBER, luisGonzalez)
    }

    static async addFursToSystem(system: HarasSystem){
        const valuesList = system.valuesLists()
        await valuesList.addFur("Fur", "fur",1, false, "fur");
    }

    public static readonly TORNADO_NAME = "Tornado"
    public static readonly TORNADO_DATE_BIRTH_STRING = "9/2/2010"
    public static readonly TORNADO_DATE_BIRTH = new Date(2010, 2, 9)
    public static readonly TORNADO_SEX = Sex.initialize("Padrillo", "Padrillo", 1, true, "Padrillo description")
    public static readonly TORNADO_LOCATION_NAME = TestBucket.LOCATION_HARAS_NAME
    public static readonly TORNADO_LOCATION = TestBucket.createTornadoLocation()
    public static readonly TORNADO_VETERINARIAN =  TestBucket.JUAN_PEREZ_VETERINARIAN
    public static readonly TORNADO_FUR = Fur.initialize("fur", "fur", 1, true, "fur description");
    public static readonly TORNADO_SHOW_IN_WEB = false
    public static readonly TORNADO_AAFETASHEET = "AAFEFataSheet"
    public static readonly TORNADO_PEDIGREE = "pedigree"
    public static readonly TORNADO_MOTHER = Horse.named("Mother Horse", TestBucket.SEX_YEGUA, TestBucket.TORNADO_LOCATION, locationDate, null, null, TestBucket.TORNADO_FUR, null, null, observation, TestBucket.TORNADO_SHOW_IN_WEB, stock, null, null, null, status)
    public static readonly TORNADO_FATHER = Horse.named("Father Horse", TestBucket.SEX_PADRILLO, TestBucket.TORNADO_LOCATION, locationDate, null, null, TestBucket.TORNADO_FUR, null, null, observation, TestBucket.TORNADO_SHOW_IN_WEB, stock, null, null, null, status)
    public static readonly TORNADO_RIDER = People.named("Juan", "Perez", "12345678", 1, "rider@gmail.com")

    createTornado(){
        return Horse.named(TestBucket.TORNADO_NAME, TestBucket.TORNADO_SEX, TestBucket.TORNADO_LOCATION, locationDate, TestBucket.TORNADO_DATE_BIRTH, TestBucket.TORNADO_VETERINARIAN, TestBucket.TORNADO_FUR, TestBucket.TORNADO_AAFETASHEET, TestBucket.TORNADO_PEDIGREE, observation, TestBucket.TORNADO_SHOW_IN_WEB, stock, TestBucket.TORNADO_FATHER, TestBucket.TORNADO_MOTHER, TestBucket.TORNADO_RIDER, status);
    }


    async addTornadoToSystem(system: HarasSystem) {
        const horses = system.horses()
        const valuesList = system.valuesLists()
        const peoples = system.peoples()
        const locations = system.locations()

        const fur = await valuesList.findFurByKey("Fur",
            ()=> {
                throw new Error(ValuesLists.ERROR_NOT_FOUND)
            })
        const veterinarian = await peoples.findVeterinarianByDNI(TestBucket.JUAN_PEREZ_DNI, () => Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        const padrillo = await system.valuesLists().findSexByKey("Padrillo", ()=> {throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        const yegua = await system.valuesLists().findSexByKey("Yegua", ()=> {throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        const rider = await peoples.findPeoplesByDNI(TestBucket.LUIS_GANZALEZ_DNI, ()=> {throw new Error(Peoples.ERROR_CAN_NOT_FOUND_PEOPLE)})
        const harasLocation = await locations.findByName(TestBucket.LOCATION_HARAS_NAME, ()=> Locations.ERROR_LOCATION_NOT_FOUND)

        // @ts-ignore
        const father = await horses.add("father", padrillo.id, harasLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, fur.id, null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)
        // @ts-ignore
        const mother = await horses.add("mother", yegua.id, harasLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, fur.id, null, null, stock, observation, false, null, null, null, null, null, clasificationKey, relatedHorseId, status, classificationDate)
        // @ts-ignore
        return await horses.add(TestBucket.TORNADO_NAME, padrillo.id, harasLocation.id, locationDate, TestBucket.TORNADO_DATE_BIRTH.toString(), veterinarian.id, fur.id, TestBucket.TORNADO_AAFETASHEET, TestBucket.TORNADO_PEDIGREE, stock, observation, TestBucket.TORNADO_SHOW_IN_WEB, father.id, mother.id, rider.id, null, null, clasificationKey, relatedHorseId, status, classificationDate)
    }

    assertTornado(tornado: Horse){
        expect(tornado.nameIs(TestBucket.TORNADO_NAME)).to.ok
        expect(tornado.locationIs(TestBucket.TORNADO_LOCATION)).to.ok
        expect(tornado.sexIs(TestBucket.TORNADO_SEX)).to.ok
        expect(tornado.showInWeb).to.false
        expect(tornado.dateOfBirthIs(TestBucket.TORNADO_DATE_BIRTH)).to.ok
        expect(tornado.veterinarianIs(TestBucket.TORNADO_VETERINARIAN)).to.ok
        expect(tornado.hasFur()).to.ok
        expect(tornado.furIs(TestBucket.TORNADO_FUR)).to.ok
        expect(tornado.hasAAFEFataSheet()).to.ok
        expect(tornado.AAFEFataSheetIs(TestBucket.TORNADO_AAFETASHEET)).to.ok
        expect(tornado.hasPedigree()).to.ok
        expect(tornado.pedigreeIs(TestBucket.TORNADO_PEDIGREE)).to.ok
        expect(tornado.hasFather()).to.true
        expect(tornado.fatherIs(TestBucket.TORNADO_FATHER)).to.ok
        expect(tornado.hasMother()).to.true
        expect(tornado.motherIs(TestBucket.TORNADO_MOTHER)).to.ok
        expect(tornado.hasRider()).to.true
        expect(tornado.riderIs(TestBucket.TORNADO_RIDER)).to.ok
    }

    async addFantasmaToSystem(system: HarasSystem) {
        const horses = system.horses()
        const tornadoLocation = await TestBucket.addTornadoLocationToSystem(system)
        const veterinarian = await TestBucket.addJuanPerezVeterinarianToSystem(system)
        const padrillo = await system.valuesLists().findSexByKey("Padrillo", ()=> {throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        const yegua = await system.valuesLists().findSexByKey("Yegua", ()=> {throw new Error(ValuesLists.ERROR_NOT_FOUND)})

        // @ts-ignore
        /*return await horses.add(TestBucket.FANTASMA_NAME, padrillo.id, tornadoLocation.id, TestBucket.FANTASMA_DATE_BIRTH.toString(), veterinarian.id,
            fur.id, null, null,
            false, null, null,null, null, null)*/
    }
}