/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Sex } from "../ValuesList/ValueList";
import {HarasSystem} from "../HarasSystem";
import { Horses } from "./Horses";
import logger from "../../logger";
import {TransformResponse} from "../Provider/TransformResponse";

export class HorsesServer{
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.post("/horses", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const horses = this._system.horses()

                const transform = new TransformResponse(request, true)
                const name = transform.getAsString("name", null)
                const locationId = transform.getAsNumber("locationId", null)
                const locationDate = transform.getAsDate("locationDate", null)
                const sex = transform.getAsNumber("sex", null)
                const dateOfBirth = transform.getAsDate("dateOfBirth", null)
                const idVeterinarian = transform.getAsNumber("idVeterinarian", null)
                const fur = transform.getAsNumber("fur", null)
                const AAFEFataSheet = transform.getAsString("AAFEFataSheet", null)
                const pedigree = transform.getAsString("pedigree", null)
                const passport = transform.getAsString("passport", null)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const observation = transform.getAsString("observation", null)
                const motherId = transform.getAsNumber("motherId", null)
                const fatherId = transform.getAsNumber("fatherId", null)
                const riderId = transform.getAsNumber("riderId", null)
                const stock = transform.getAsNumber("stock", 0)
                const dosis = transform.getAsNumber("dosis", 0)
                const status = transform.getAsBoolean("status", null)
                const ownerId = transform.getAsNumber("ownerId", null)

                const images = transform.getArrayBufferFromFile("imageProfile", null)
                let imageProfileName = null
                let imageBuffer = null
                if(images !== null) {
                    imageProfileName = images[0].name
                    imageBuffer = images[0].arrayBuffer
                }

                const classificationDate = transform.getAsDate("classificationDate", null)
                const classificationKey = transform.getAsNumber("classificationKey", null)
                const relatedHorseId = transform.getAsNumber("relatedHorseId", null)

                await horses.add(name, sex, locationId, locationDate, dateOfBirth, idVeterinarian, fur, AAFEFataSheet,
                    pedigree, passport, stock, dosis, observation, showInWeb, fatherId, motherId, riderId, imageProfileName, imageBuffer,
                    classificationKey, relatedHorseId, status, classificationDate, ownerId)

                await this._system.commitTransaction()
                response.json({status: "ok"})
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/horses/:id/changeLocation", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const horses = this._system.horses()

                const idHorse = request.params.id
                const transform = new TransformResponse(request, true)
                const locationId = transform.getAsNumber("location", null)
                const date = transform.getAsDate("date", null)

                await horses.changeLocation(idHorse, locationId,date)

                await this._system.commitTransaction()
                response.json({status: "ok"})
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/:id/locations", async (request: any, response: any) => {
            try {
                const horses = this._system.horses()

                const idHorse = request.params.id
                const transform = new TransformResponse(request, false)
                const limit = transform.getAsNumber("limit", 1000)
                const page = transform.getAsNumber("page", 0)

                const locations = await horses.findAllLocationsByHorse(idHorse, page, limit);

                response.json(locations)
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/:id/lastLocation", async (request: any, response: any) => {
            try {
                const horses = this._system.horses()

                const idHorse = request.params.id

                const locations = await horses.findLastLocationByHorse(idHorse);

                response.json(locations)
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/getLastCycle", async (request: any, response: any) => {
            try {
                let {page, limit, order} = request.query

                if(order !== undefined){
                    order = JSON.parse(order)
                }
                else{
                    order = {
                        field: "id",
                        order: "DESC"
                    }
                }

                if(page === undefined )
                    page = 0
                if(limit === undefined)
                    limit = 50000

                const horses = this._system.horses()

                const horsesFound = await horses.getYeguaGestanteWhitLastCycle(page, limit)
                response.json( {
                    "total": horsesFound[1],
                    "page": page,
                    "rows": horsesFound[0]
                })
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/horses/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const horses = this._system.horses()

                const idHorse = request.params.id

                const transform = new TransformResponse(request, true)
                const name = transform.getAsString("name", null)
                const sex = transform.getAsNumber("sex", null)
                const dateOfBirth = transform.getAsDate("dateOfBirth", null)
                const idVeterinarian = transform.getAsNumber("idVeterinarian", null)
                const fur = transform.getAsNumber("fur", null)
                const AAFEFataSheet = transform.getAsString("AAFEFataSheet", null)
                const pedigree = transform.getAsString("pedigree", null)
                const passport = transform.getAsString("passport", null)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const observation = transform.getAsString("observation", null)
                const motherId = transform.getAsNumber("motherId", null)
                const fatherId = transform.getAsNumber("fatherId", null)
                const riderId = transform.getAsNumber("riderId", null)
                const stock = transform.getAsNumber("stock", 0)
                const dosis = transform.getAsNumber("dosis", 0)
                const status = transform.getAsBoolean("status", null)
                const images = transform.getArrayBufferFromFile("imageProfile", null)
                const ownerId = transform.getAsNumber("ownerId", null)
                let imageProfileName = null
                let imageProfileArrayBuffer = null
                if(images !== null) {
                    imageProfileName = images[0].name
                    imageProfileArrayBuffer = images[0].arrayBuffer
                }

                await horses.update(idHorse, name, sex, dateOfBirth, idVeterinarian, fur, AAFEFataSheet, pedigree, passport, showInWeb,
                    observation, fatherId, motherId, riderId, imageProfileName, imageProfileArrayBuffer, stock, dosis, status,ownerId)

                await this._system.commitTransaction() 
                response.json({status: "ok"})
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses", async (request: any, response: any) => {
            try {
                let {page, limit, search, order, filter} = request.query

                if(search === undefined) {
                    search = ""
                }

                if(filter !== undefined){
                    filter = JSON.parse(filter)
                }
                else {
                    filter = []
                }

                if(order !== undefined){
                    order = JSON.parse(order)
                }
                else{
                    order = {
                        field: "id",
                        order: "DESC"
                    }
                }

                if(page === undefined )
                    page = 0
                if(limit === undefined)
                    limit = 0

                const horses = this._system.horses()

                const horsesFound = await horses.filter(search, filter, page, limit, order)

                response.json( {
                    "total": horsesFound[1],
                    "page": page,
                    "rows": horsesFound[0]
                })
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/showInWeb", async (request: any, response: any) => {
            try {
                let {page, limit, order} = request.query

                if(order !== undefined){
                    order = JSON.parse(order)
                }
                else{
                    order = {
                        field: "id",
                        order: "DESC"
                    }
                }
                const filter: any[] = []
                if(page === undefined )
                    page = 0
                if(limit === undefined)
                    limit = 50

                const horses = this._system.horses()

                const horsesFound = await horses.filterShowInWeb("", filter,page, limit, order)

                response.json( {
                    "total": horsesFound[1],
                    "page": page,
                    "rows": horsesFound[0]
                })
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/list", async (request: any, response: any) => {
            try {
                const filter: any[] = []
                const order = {field: "name", order: "ASC"}
                const page = 0
                const limit = 0
                const search = ""

                const horses = this._system.horses()

                const horsesFound = await horses.filter(search, filter, page, limit, order)

                response.json( horsesFound[0])
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/:id", async (request: any, response: any) => {
            try {
                const idHorse = request.params.id
                const horses = this._system.horses()
                const horsesFound = await horses.findById(idHorse,  () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })

                response.json(horsesFound)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/sex/:sexId", async (request: any, response: any) => {
            this.executeSystemAction(async () => {
                const horses = this._system.horses()
                const sexId = request.params.sexId
                return  await horses.findBySexId(sexId,
                    () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })

            }, request, response)
        })

        server.get("/horses/sexcode/:sexcode", async (request: any, response: any) => {
            this.executeSystemAction(async () => {
                const horses = this._system.horses()
                const sexlist =  this._system.valuesLists()
                const sexcode = request.params.sexcode
                const sex = await sexlist.findSexByKey(sexcode,
                    () => { throw new Error(Sex.ERROR_INCORRECT_ID) })
                // @ts-ignore
                return  await horses.findBySexId(sex.id,
                    () => { throw new Error(Horses.ERROR_CAN_NOT_FOUND_HORSE) })
            }, request, response)
        })

        server.delete("/horses/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const horses = this._system.horses()

                const horseId = request.params.id
                await horses.softDelete(horseId)
                await this._system.commitTransaction()
                response.json({status: "ok"})
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/horses/media/:id", async (request: any, response: any) => {
            try {
                const idHorse = request.params.id
                const transform = new TransformResponse(request, false)
                const type = transform.getAsString("type", null)
                const limit = transform.getAsNumber("limit", 1000)
                const page = transform.getAsNumber("page", 0)

                const horses = this._system.horses()

                const horsesFound = await horses.findImagesByIdAndType(idHorse, type, limit, page)

                response.json( {
                    "total": horsesFound[1],
                    "page": page,
                    "rows": horsesFound[0]
                })
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/export/horses", async (request: any, response: any) => {
            try {
                
    
                const horses = this._system.horses()
    
                const horsesFound = await horses.exportHorses()
    
                response.json( horsesFound )
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/simplifyhorses", async (request: any, response: any) => {
            try {
                const horses = this._system.horses()
    
                const simplifyhorses = await horses.getAllSimplify();
    
                response.json(simplifyhorses)
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
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
            logger.error(`Error in Horse Server. Error: ${error.message}`)
            res.status(400);
            res.send({msg: error.message});
        }
    }
}