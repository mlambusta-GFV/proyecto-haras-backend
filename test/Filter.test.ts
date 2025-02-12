import {TestBucket} from "./TestBucket";
import {HarasSystem} from "../src/HarasSystem";
import {Locations} from "../src/Locations/Locations";
import {Horses} from "../src/Horse/Horses";
import {Peoples} from "../src/Peoples/Peoples";
import {ValuesLists} from "../src/ValuesList/ValuesLists";
import {createConnection} from "typeorm";
import {PersistentHarasSystem} from "../PersistentHarasSystem";
import {Horse} from "../src/Horse/Horse";
import {PersistentHorses} from "../src/Horse/PersistentHorses";

const assert = require("assert");
const chai = require("chai")
const expect = chai.expect
chai.use(require("chai-as-promised"))

describe("Filter ", ()=> {
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
        valuesLists = system.valuesLists()

        await TestBucket.addFursToSystem(system)
        await TestBucket.addSexesToSystem(system)
        await TestBucket.addPeoplesToSystem(system)
        await TestBucket.addVeterinarianToSystem(system)
        await TestBucket.addLocationsToSystem(system)
        await TestBucket.addInterventionTypeToSystem(system)
    });

    afterEach(async ()=>{
        await system.commitTransaction()
        await system.stop()
    });

    it("Filter whit one conditions", async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters = [
            {
                name: "name",
                values: [TestBucket.TORNADO_NAME],
                condition: "equal",
                type: "string"
            }
        ]
        // @ts-ignore
        const horsesFound: Horse[] = (await horses.filter("", filters, 0, 10, null))[0]

        expect(horsesFound.length).to.eq(1)
        expect(tornado.isEqual(horsesFound[0])).to.ok
    });

   /* it('Filter whit more than one conditions', async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters = [
            {
                name: "name",
                values: [TestBucket.TORNADO_NAME],
                condition: "equal",
                type: "string"
            },
            {
                name: "fur",
                values: [tornadoFur.id],
                condition: "equal",
                type: "object"
            }
        ]
        // @ts-ignore
        const horsesFound: Horse[] = (await horses.filter("", filters, 0, 10, null))[0]

        expect(horsesFound.length).to.eq(1)
        expect(tornado.isEqual(horsesFound[0])).to.ok
    });*/

   /* it('Filter whit object condition', async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters = [
            {
                name: "name",
                values: [TestBucket.TORNADO_NAME],
                condition: "equal",
                type: "string"
            },
            {
                name: "location",
                values: [tornadoLocation.id],
                condition: "equal",
                type: "object"
            }
        ]
        // @ts-ignore
        const horsesFound: Horse[] = (await horses.filter("", filters, 0, 10, null))[0]

        expect(horsesFound.length).to.eq(1)
        expect(tornado.isEqual(horsesFound[0])).to.ok
    });*/

    it("Filter with boolean condition", async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters = [
            {
                name: "name",
                values: [TestBucket.TORNADO_NAME],
                condition: "equal",
                type: "string"
            },
            {
                name: "showInWeb",
                values: [TestBucket.TORNADO_SHOW_IN_WEB],
                condition: "equal",
                type: "boolean"
            }
        ]
        // @ts-ignore
        const horsesFound: Horse[] =( await horses.filter("", filters, 0, 10, null))[0]

        expect(horsesFound.length).to.eq(1)
        expect(tornado.isEqual(horsesFound[0])).to.ok
    });

    it("Can not filter with invalid condition", async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters = [
            {
                name: "name",
                values: [TestBucket.TORNADO_NAME],
                condition: "equal",
                type: "invalid type"
            },
            {
                name: "showInWeb",
                values: [TestBucket.TORNADO_SHOW_IN_WEB],
                condition: "equal",
                type: "boolean"
            }
        ]

        await expect(horses.filter("", filters, 0, 10, null)).to.be.rejectedWith(Error, PersistentHorses.ERROR_INVALID_FILTER_TYPE)
    });

    it("Filter with like conditions", async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters: [{ name: string; values: [string]; condition: string; type: string }] = [
            {
                name: "name",
                values: ["To"],
                condition: "like",
                type: "string"
            }
        ]
        // @ts-ignore
        const horsesFound: Horse[] = (await horses.filter("", filters, 0, 10, null))[0]

        expect(horsesFound.length).to.eq(1)
        expect(tornado.isEqual(horsesFound[0])).to.ok
    });

    it("Can not filter with invalid columns", async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()

        const filters:[{ name: string; values: [string]; condition: string; type: string }] = [{
            name: "failed name",
            values: ["To"],
            condition: "like",
            type: "string"
        }]

        await expect(horses.filter("", filters, 0, 10, null)).to.be.rejectedWith(Error, PersistentHorses.ERROR_INVALID_FILTER_NAME)
    });

    it("Filter and search", async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters = {
            search: "Tor",
            filters: [
                {
                    name: "showInWeb",
                    values: ["false"],
                    condition: "equal",
                    type: "boolean"
                }
            ]
        }

        // @ts-ignore
        const horsesFound: Horse[] = (await horses.filter(filters.search, filters.filters, 0, 10, null))[0]

        expect(horsesFound.length).to.eq(1)
        expect(tornado.isEqual(horsesFound[0])).to.ok
    });

   /* it('Filter without conditions', async ()=> {
        const tornado = await testBucket.addTornadoToSystem(system)

        await system.commitTransaction()
        await system.beginTransaction()
        const filters = {
            search: '',
            filters: [{}]
        }

        // @ts-ignore
        const horsesFound: Horse[] = (await horses.filter(filters.search, filters.filters, 0, 10, null))[0]

        expect(horsesFound.length).to.eq(3)
        expect(tornado.isEqual(horsesFound[2])).to.ok
        expect(fantasma.isEqual(horsesFound[0])).to.ok
        expect(mother.isEqual(horsesFound[1])).to.ok
    });*/
})