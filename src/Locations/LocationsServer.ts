import { HarasSystem } from "../HarasSystem";
import { Locations } from "./Locations";

export class LocationsServer {
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.post("/locations", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const locations = this._system.locations()
                const { name, address, phoneNumber, personCharge } = request.body
                // @ts-ignore
                await locations.add(name, address, phoneNumber, personCharge)
                await this._system.commitTransaction()
                response.json({ status: 'OK' })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/locations", async (request: any, response: any) => {
            try {
                const locations = this._system.locations()

                const allLocations = await locations.getAll();
                response.json(allLocations)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/locations/:id", async (request: any, response: any) => {
            try {
                const locations = this._system.locations()
                const locationId = request.params.id
                const location = await locations.findById(locationId, () => { throw new Error(Locations.ERROR_LOCATION_NOT_FOUND) })

                response.json(location)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/locations/personcharge/:personchargeid", async (request: any, response: any) => {
            try {
                const locations = this._system.locations()
                const horseId = request.params.personchargeid
                const location = await locations.findByPersonCharge(horseId, () => { throw new Error(Locations.ERROR_LOCATION_NOT_FOUND) })

                response.json(location)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.delete("/locations/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const locations = this._system.locations()
                const locationId = request.params.id
                locations.softDeleteFromLocation(locationId)
                await this._system.commitTransaction()
                response.json({ status: "OK" })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.put("/locations/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const locations = this._system.locations()
                const locationId = request.params.id
                const { name, address, phoneNumber, personCharge } = request.body
                const location = await locations.findAndUpdate(locationId, name, address, phoneNumber, personCharge)
                await this._system.commitTransaction()
                response.json(location)
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })
    }
}