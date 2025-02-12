import {TestBucket} from "./TestBucket";
import {Horse} from "../src/Horse/Horse";
import {Veterinarian} from "../src/Peoples/Veterinarian";
import {Appointment} from "../src/ClinicHistory/Appointment";
import {Diagnosis} from "../src/ClinicHistory/Diagnosis";
import {HarasSystem} from "../src/HarasSystem";
import {Locations} from "../src/Locations/Locations";
import {Horses} from "../src/Horse/Horses";
import {Peoples} from "../src/Peoples/Peoples";
import {createConnection} from "typeorm";
import {PersistentHarasSystem} from "../PersistentHarasSystem";
import {ValuesLists} from "../src/ValuesList/ValuesLists";
import {ClinicHistory} from "../src/ClinicHistory/ClinicHistory";
import {Treatment} from "../src/ClinicHistory/Treatment";
import {Interventions} from "../src/ClinicHistory/Interventions";

const chai = require("chai")
const expect = chai.expect
const assert = require("assert");
chai.use(require("chai-as-promised"))

describe("Clinic History Test", ()=> {
    const testBucket = new TestBucket()

    it("Can create appointment", function () {
        const tornado = testBucket.createTornado()
        const veterinarian = TestBucket.JUAN_PEREZ_VETERINARIAN
        const veterinarianAssistant: Veterinarian = null
        const info = "Information"
        const date = new Date()

        const appointment = Appointment.with(tornado, veterinarian, veterinarianAssistant, "name", info, date)

        expect(appointment.horseIs(tornado)).to.ok
        expect(appointment.veterinarianIs(veterinarian)).to.ok
        expect(appointment.veterinarianAssistantIs(veterinarianAssistant)).to.false
        expect(appointment.informationIs(info)).to.ok
        expect(appointment.dateIs(date)).to.ok
        expect(appointment.hasDiagnosis()).to.false
    });

    it("Can not create appointment without horse", function () {
        const horse: Horse = null
        const veterinarian = TestBucket.JUAN_PEREZ_VETERINARIAN
        const veterinarianAssistant: Veterinarian = null
        const info = "Information"
        const date = new Date()

        assert.throws(
            ()=> Appointment.with(null, veterinarian, veterinarianAssistant, "name", info, date),
            Error,
            Appointment.ERROR_HORSE_EMPTY
        )
    });

    it("Can create appointment with one diagnosis", function () {
        const tornado = testBucket.createTornado()
        const veterinarian = TestBucket.JUAN_PEREZ_VETERINARIAN
        const veterinarianAssistant: Veterinarian = null
        const info = "Information"
        const date = new Date()

        const appointment = Appointment.with(tornado, veterinarian, veterinarianAssistant, "name", info, date)
        const diagnosisName = "diagnosis Name"
        const diagnosisInfo = "diagnosis Information"
        appointment.addDiagnosis(diagnosisName, diagnosisInfo, anamnesis)

        expect(appointment.horseIs(tornado)).to.ok
        expect(appointment.veterinarianIs(veterinarian)).to.ok
        expect(appointment.veterinarianAssistantIs(veterinarianAssistant)).to.false
        expect(appointment.informationIs(info)).to.ok
        expect(appointment.dateIs(date)).to.ok
        expect(appointment.hasDiagnosis()).to.ok
        expect(appointment.amountDiagnosis()).to.be.eq(1)
    });

    it("Can not create appointment without diagnosis", function () {
        const tornado = testBucket.createTornado()
        const veterinarian = TestBucket.JUAN_PEREZ_VETERINARIAN
        const veterinarianAssistant: Veterinarian = null
        const info = "Information"
        const date = new Date()

        const appointment = Appointment.with(tornado, veterinarian, veterinarianAssistant, "name", info, date)
        const diagnosisInfo = "diagnosis Information"

        assert.throws(
            ()=> appointment.addDiagnosis(null, diagnosisInfo, anamnesis),
            Error,
            Diagnosis.ERROR_NAME_CAN_NOT_BE_EMPTY
        )

        expect(appointment.hasDiagnosis()).to.false
    });

    it("Can create new treatment", function () {
        const tornado = testBucket.createTornado()
        const veterinarian = TestBucket.JUAN_PEREZ_VETERINARIAN
        const veterinarianAssistant: Veterinarian = null
        const info = "Information"
        const date = new Date()

        const appointment = Appointment.with(tornado, veterinarian, veterinarianAssistant, "name", info, date)
        const diagnosisName = "diagnosis Name"
        const diagnosisInfo = "diagnosis Information"
        const diagnosis = appointment.addDiagnosis(diagnosisName, diagnosisInfo, anamnesis)

        const startDate = new Date()
        const treatment = diagnosis.addTreatment("teatment", "treatment info", startDate, null)

        expect(diagnosis.amountTreatments()).to.eq(1)
        expect(diagnosis.hasTreatment(treatment)).to.ok
    });

    it("Can not create new treatment without required filed ", function () {
        const tornado = testBucket.createTornado()
        const veterinarian = TestBucket.JUAN_PEREZ_VETERINARIAN
        const veterinarianAssistant: Veterinarian = null
        const info = "Information"
        const date = new Date()

        const appointment = Appointment.with(tornado, veterinarian, veterinarianAssistant, "name", info, date)
        const diagnosisName = "diagnosis Name"
        const diagnosisInfo = "diagnosis Information"
        const diagnosis = appointment.addDiagnosis(diagnosisName, diagnosisInfo, anamnesis)

        const startDate = new Date()
        assert.throws(
            ()=> diagnosis.addTreatment("teatment", "treatment info", null, null),
            Error,
            Treatment.ERROR_START_DATE_EMPTY
        )

        expect(diagnosis.hasAnyTreatment()).to.false
    });

    it("Can set end date to treatment", function () {
        const tornado = testBucket.createTornado()
        const veterinarian = TestBucket.JUAN_PEREZ_VETERINARIAN
        const veterinarianAssistant: Veterinarian = null
        const info = "Information"
        const today = new Date()

        const appointment = Appointment.with(tornado, veterinarian, veterinarianAssistant, "name", info, today)
        const diagnosisName = "diagnosis Name"
        const diagnosisInfo = "diagnosis Information"
        const diagnosis = appointment.addDiagnosis(diagnosisName, diagnosisInfo, anamnesis)

        const startDate = new Date()
        const treatment = diagnosis.addTreatment("teatment", "treatment info", startDate, null)
        const endDate = new Date()
        endDate.setDate(today.getDate() +1 )
        diagnosis.setEndDate(treatment, endDate)

        expect(diagnosis.amountTreatments()).to.eq(1)
        expect(diagnosis.hasTreatment(treatment)).to.ok
    });
})


describe("Clinic History system", ()=> {
    const testBucket = new TestBucket()
    let system: HarasSystem = null
    let locations: Locations = null
    let horses: Horses = null
    let peoples: Peoples = null
    let clinicHistory: ClinicHistory = null
    let valuesLists: ValuesLists = null

    beforeEach(async () => {
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
            dropSchema: true
        })

        system = new PersistentHarasSystem()
        //system = new TransientHarasSystem()
        await system.start()
        await system.beginTransaction()
        locations = system.locations()
        horses = system.horses()
        peoples = system.peoples()
        clinicHistory = system.clinicHistory()
        valuesLists = system.valuesLists()

        await TestBucket.addFursToSystem(system)
        await TestBucket.addSexesToSystem(system)
        await TestBucket.addPeoplesToSystem(system)
        await TestBucket.addVeterinarianToSystem(system)
        await TestBucket.addLocationsToSystem(system)
        await TestBucket.addInterventionTypeToSystem(system)
    });

    afterEach(async () => {
        await system.commitTransaction()
        await system.stop()
    });

    it("Can create appointment", async () => {
        const veterinarian = await peoples.findVeterinarianByDNI(TestBucket.JUAN_PEREZ_DNI, () => Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        const tornado = await testBucket.addTornadoToSystem(system)

        const appointment = await clinicHistory.addAppointment(tornado.id, veterinarian.id, null, "info", new Date(), "name")

        expect(clinicHistory.amountAppointment()).to.ok
        expect(clinicHistory.containAppointmentId(appointment.id))
    });

    it("Can create appointment with diagnosis", async () => {
        const veterinarian = await peoples.findVeterinarianByDNI(TestBucket.JUAN_PEREZ_DNI, () => Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        const tornado = await testBucket.addTornadoToSystem(system)
        const appointment = await clinicHistory.addAppointment(tornado.id, veterinarian.id, null, "info", new Date(), "name")
        const diagnosisName = "diagnosis name"
        const diagnosisInfo = "diagnosis info"
        const diagnosis =  await clinicHistory.addDiagnosis(appointment.id, diagnosisName, diagnosisInfo, anamnesis)

        expect(diagnosis.appointmentIs(appointment)).to.ok
        expect(diagnosis.nameIs(diagnosisName)).to.ok
        expect(diagnosis.infoIs(diagnosisInfo)).to.ok
    });

    it("Can create treatment", async () => {
        const veterinarian = await peoples.findVeterinarianByDNI(TestBucket.JUAN_PEREZ_DNI, () => Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        const tornado = await testBucket.addTornadoToSystem(system)
        const appointment = await clinicHistory.addAppointment(tornado.id, veterinarian.id, null, "info", new Date(), "name")
        const diagnosisName = "diagnosis name"
        const diagnosisInfo = "diagnosis info"
        const diagnosis =  await clinicHistory.addDiagnosis(appointment.id, diagnosisName, diagnosisInfo, anamnesis)

        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(startDate.getDate() +1 )
        const treatmentName = "name treatment"
        const infoTreatment = "info treatyment"
        const treatment = await clinicHistory.addTreatment(diagnosis.id, treatmentName, infoTreatment, startDate, endDate)

        expect(treatment.diagnosisIs(diagnosis)).to.ok
        expect(treatment.nameIs(treatmentName)).to.ok
        expect(treatment.infoIs(infoTreatment)).to.ok
    });

    it("Can add Intervention in appointment", async () => {
        const veterinarian = await peoples.findVeterinarianByDNI(TestBucket.JUAN_PEREZ_DNI, () => Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        const tornado = await testBucket.addTornadoToSystem(system)

        const appointment = await clinicHistory.addAppointment(tornado.id, veterinarian.id,
            null, "info", new Date(), "name")
        const type = await valuesLists.findByKey("InterventionType", "INTERVENTION_TYPE",
            ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)})
        const descriptions = "interventions description";
        const interventions =  await clinicHistory.addIntervention(appointment.id, descriptions, type.id)

        expect(interventions.descriptionIs(descriptions)).to.ok
        expect(interventions.hasAppointment(appointment)).to.ok
    });

    it("Can not add Intervention without type", async () => {
        const veterinarian = await peoples.findVeterinarianByDNI(TestBucket.JUAN_PEREZ_DNI, () => Peoples.ERROR_CAN_NOT_FOUND_VETERINARIAN)
        const tornado = await testBucket.addTornadoToSystem(system)

        const appointment = await clinicHistory.addAppointment(tornado.id, veterinarian.id,
            null, "info", new Date(), "name")
        const type = await valuesLists.findByKey("InterventionType", "INTERVENTION_TYPE",
            ()=>{throw new Error(ValuesLists.ERROR_NOT_FOUND)})

        await expect(clinicHistory.addIntervention(appointment.id, null, type.id))
            .to.be.rejectedWith(Error, Interventions.ERROR_DESCRIPTION_CAN_NOT_BE_EMPTY)

    });
})
