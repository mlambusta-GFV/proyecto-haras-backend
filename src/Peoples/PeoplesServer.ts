import {HarasSystem} from "../HarasSystem";
import logger from "../../logger";

export class PeoplesServer {
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.get("/human/all", async (request: any, response: any) => {
            this.executeSystemAction(async ()=> {
                const peoples = this._system.peoples()

                return  await peoples.getAllHuman();
            },request, response)
        })

        server.post("/human/veterinarian", async (request: any, response: any) => {
            this.executeSystemAction(async ()=> {
                const peoples = this._system.peoples()
                const {firstName, lastName, dni, registrationNumber, userManagerId, email} = request.body

                return  await peoples.addVeterinarian(firstName, lastName, dni, registrationNumber, userManagerId, email)

            },request, response)
        })

        server.get("/human/veterinarian", async (request: any, response: any) => {
            this.executeSystemAction(async ()=> {
                const peoples = this._system.peoples()

                return  await peoples.getAllVeterinarian();
            },request, response)
        })

        server.post("/human/peoples", async (request: any, response: any) => {
            this.executeSystemAction(async ()=> {
                const peoples = this._system.peoples()

                const {firstName, lastName, dni, userManagerId, email} = request.body

                return await peoples.addPeople(firstName, lastName, dni, userManagerId, email)

            },request, response)
        })

        server.get("/human/peoples", async (request: any, response: any) => {
            this.executeSystemAction(async ()=> {
                const peoples = this._system.peoples()

                return await peoples.getAllPeoples();

            },request, response)
        })

        server.get("/simplifyriders", async (request: any, response: any) => {
            this.executeSystemAction(async ()=> {
                const peoples = this._system.peoples()

                return await peoples.getAllRiders();

            },request, response)
        })

        server.delete("/human/:id", async (request: any, response: any) => {
            this.executeSystemAction(async ()=> {
                const peoples = this._system.peoples();
                const idHuman = request.params.id

                return await peoples.softDelete(idHuman)

            },request, response)
        })
    }

    async executeSystemAction(systemAction: () => any, req: any, res: any) {
        try {
            logger.info(`${req.url}`)
            const data =  await systemAction();
            res.status(200);
            if(data !== undefined)
                res.send(data);
            else
                res.send({status: "ok"});
        } catch (error) {
            logger.error(`Error in Peoples. Error: ${error.message}`)
            res.status(400);
            res.send({msg: error.message});
        }
    }
}