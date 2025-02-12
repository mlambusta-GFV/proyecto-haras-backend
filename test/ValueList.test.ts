import {TestBucket} from "./TestBucket";
import {Fur, Sex} from "../src/ValuesList/ValueList";
import {HarasSystem} from "../src/HarasSystem";
import {Locations} from "../src/Locations/Locations";
import {Horses} from "../src/Horse/Horses";
import {Peoples} from "../src/Peoples/Peoples";
import {createConnection} from "typeorm";
import {PersistentHarasSystem} from "../PersistentHarasSystem";
import {ValuesLists} from "../src/ValuesList/ValuesLists";

const chai = require("chai")
const expect = chai.expect
const assert = require("assert");

describe("Value list", ()=> {
    const testBucket = new TestBucket()
    let system: HarasSystem = null
    let locations: Locations = null
    let horses: Horses = null
    let peoples: Peoples = null
    let valuesList: ValuesLists = null

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
            logging: true
        })

        system = new PersistentHarasSystem()
        //system = new TransientHarasSystem()
        await system.start()
        await system.beginTransaction()
        locations = system.locations()
        horses = system.horses()
        peoples = system.peoples()
        valuesList = system.valuesLists()
    });

    afterEach(async ()=>{
        await system.commitTransaction()
        await system.stop()
    });

    it("1", function() {
        const key = "Padrillo"
        const value = "Padrillo value"
        const order = 1
        const filter = true
        const description = "Padrillo description"

        const sex = Sex.initialize(key, value, order, filter, description)

        expect(sex.keyIs(key)).to.ok
        expect(sex.valueIs(value)).to.ok
        expect(sex.orderIs(order)).to.ok
        expect(sex.filterIs(filter)).to.ok
        expect(sex.descriptionIs(description)).to.ok
    })

    it("2", async ()=> {
        const key = "Padrillo"
        const value = "Padrillo value"
        const order = 1
        const filter = true
        const description = "Padrillo description"

        const sexAdd = await valuesList.addSex(key, value, order, filter, description)

        expect(sexAdd.keyIs(key)).to.ok
        expect(sexAdd.valueIs(value)).to.ok
        expect(sexAdd.orderIs(order)).to.ok
        expect(sexAdd.filterIs(filter)).to.ok
        expect(sexAdd.descriptionIs(description)).to.ok
    })

    it("3", async ()=> {
        const padrilloKey = "Padrillo"
        const padrilloValue = "Padrillo value"
        const padrilloOrder = 1
        const padrilloFilter = true
        const padrilloDescription = "Padrillo description"

        const yeguaKey = "Yegua"
        const yeguaValue = "Yegua value"
        const yeguaOrder = 2
        const yeguaFilter = true
        const yeguaDescription = "Yegua description"

        const padrillo = await valuesList.addSex(padrilloKey, padrilloValue, padrilloOrder, padrilloFilter, padrilloDescription)
        const yegua = await valuesList.addSex(yeguaKey, yeguaValue, yeguaOrder, yeguaFilter, yeguaDescription)

        expect(await valuesList.amountSex()).to.be.eq(2)
        expect(await valuesList.hasSex(padrillo)).to.ok
        expect(await valuesList.hasSex(yegua)).to.ok
    })
})