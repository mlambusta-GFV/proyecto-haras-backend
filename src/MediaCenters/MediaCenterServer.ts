import {HarasSystem} from "../HarasSystem";
import {FileSystemMediaCenter} from "./FileSystemMediaCenter";
import {TransformResponse} from "../Provider/TransformResponse";

export class MediaCenterServer{
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.get("/mediacenter/tags",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

                const tags = await mediaCenter.getAllTags()

                response.json(tags)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/mediacenter/showInWeb",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

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
                    limit = 50

                const files = await mediaCenter.getAllShowInWeb(search, filter, page, limit, order)

                response.json( {
                    "total": files[1],
                    "page": page,
                    "rows": files[0]
                })
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/mediacenter/tags",async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const mediaCenter = this._system.mediaCenter()
                const name = request.body.name

                const tags = await mediaCenter.addTag(name)
                await this._system.commitTransaction()
                response.json(tags)
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/mediacenter/tags/:id",async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const mediaCenter = this._system.mediaCenter()
                const id = request.params.id
                const name = request.body.name
                const tags = await mediaCenter.updateTag(id, name)
                await this._system.commitTransaction()
                response.json(tags)
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/mediacenter/trainings/:idHorse",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

                const idHorse = request.params.idHorse
                const transform = new TransformResponse(request, true)
                const idHorseRider = transform.getAsNumber("idHorseRider", null)
                const jump = transform.getAsString("jump", null)
                const result = transform.getAsNumber("result",null)
                const faults = transform.getAsNumber("faults",null)
                const club = transform.getAsString("club", null)
                const images = transform.getArrayBufferFromFile("image", null)
                let imageName = null
                let imageBuffer = null
                if(images !== null) {
                    imageName = images[0].name
                    imageBuffer = images[0].arrayBuffer
                }

                const description = transform.getAsString("description", null)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const name = transform.getAsString("name", null)
                const date = transform.getAsDate("date", null)

                await mediaCenter.addTrainingFile(imageName, description, imageBuffer, idHorse, idHorseRider, jump,
                    faults, result, club, showInWeb, name, date)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/mediacenter/trainings/:idHorse",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()
                const idHorse = request.params.idHorse

                let {page, limit} = request.query

                if(page === undefined )
                    page = 0
                if(limit === undefined)
                    limit = 50


                const horsesFound = await mediaCenter.getAllFileTrainingsById(idHorse, page, limit)

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

        server.get("/mediacenter/training/:idtraining",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()
                const idtraining = request.params.idtraining

                let {page, limit} = request.query

                if(page === undefined )
                    page = 0
                if(limit === undefined)
                    limit = 50


                const horsesFound = await mediaCenter.findById(idtraining)

                response.json( {
                    horsesFound
                })
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/mediacenter/trainings/:idTraining",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

                const idTraining = request.params.idTraining
                const transform = new TransformResponse(request, true)
                const idHorseRider = transform.getAsNumber("idHorseRider", null)
                const jump = transform.getAsString("jump", null)
                const result = transform.getAsNumber("result",null)
                const faults = transform.getAsNumber("faults",null)
                const club = transform.getAsString("club", null)
                const description = transform.getAsString("description", null)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const name = transform.getAsString("name", null)
                const date = transform.getAsDate("date", null)

                await mediaCenter.updateTrainingFile(idTraining, idHorseRider, jump, faults, result, club, description, showInWeb, name, date)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/mediacenter/competitions",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()
                const data = await mediaCenter.getCompetitions()
                response.json( {data})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/mediacenter/educations/:idHorse",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

                const idHorse = request.params.idHorse
                const transform = new TransformResponse(request, true)
                const locationId = transform.getAsNumber("locationId", null)
                const idResponsible = transform.getAsNumber("responsibleId", null)
                const images = transform.getArrayBufferFromFile("image", null)
                let imageName = null
                let imageBuffer = null
                if(images !== null) {
                    imageName = images[0].name
                    imageBuffer = images[0].arrayBuffer
                }

                const description = transform.getAsString("description", null)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const name = transform.getAsString("name", null)
                const date = transform.getAsDate("date", null)

                await mediaCenter.addEducationFile(imageName, description, imageBuffer, idHorse, locationId, idResponsible, showInWeb, name, date)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/mediacenter/educations/:idHorse",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()
                const idHorse = request.params.idHorse

                let {page, limit} = request.query

                if(page === undefined )
                    page = 0
                if(limit === undefined)
                    limit = 50


                const horsesFound = await mediaCenter.getAllFileEducationById(idHorse, page, limit)

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

        server.put("/mediacenter/educations/:idEducation",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

                const idEducation = request.params.idEducation
                const transform = new TransformResponse(request, true)
                const locationId = transform.getAsNumber("locationId", null)
                const idResponsible = transform.getAsNumber("responsibleId", null)
                const description = transform.getAsString("description", null)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const name = transform.getAsString("name", null)
                const date = transform.getAsDate("date", null)

                await mediaCenter.updateEducationFile(idEducation, locationId, idResponsible, description, showInWeb, name, date)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.delete("/mediacenter/:idFile",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

                const idFile = request.params.idFile

                await mediaCenter.deleteFile(idFile)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/mediacenter/:idHorse",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()
                const horses = this._system.horses()

                const idHorse = request.params.idHorse
                const foundHorse = await horses.findById(idHorse,
                    ()=> new Error(FileSystemMediaCenter.FILE_NOT_FOUND))

                const transform = new TransformResponse(request,true)
                const images = transform.getArrayBufferFromFile("image", null)
                let fileName = null
                let fileData = null
                if(images !== null) {
                    fileName = images[0].name
                    fileData = images[0].arrayBuffer
                }

                const tags = transform.getAsJSON("tags", [])
                const description = transform.getAsString("description", null)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const name = transform.getAsString("name", null)
                const date = transform.getAsDate("date", null)

                await mediaCenter.addHorseFile(fileName, description, fileData, foundHorse, tags, showInWeb, name, date)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/mediacenter/:id",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()
                const id = request.params.id

                const fileGeneric = await mediaCenter.findById(id)
                if(fileGeneric.isImageType())
                    response.set("Content-Type", "image/png");
                else if (fileGeneric.isVideoType())
                    response.set("Content-Type", "video/mp4");
                else
                    response.set("Content-Type", "application/pdf");

                response.sendFile(fileGeneric.fullPath())
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/mediacenter/:idHorse",async (request: any, response: any) => {
            try {
                const mediaCenter = this._system.mediaCenter()

                const idHorse = request.params.idHorse
                const transform = new TransformResponse(request, true)
                const showInWeb = transform.getAsBoolean("showInWeb", null)
                const name = transform.getAsString("name", null)
                const date = transform.getAsDate("date", null)

                await mediaCenter.updateHorseFile(idHorse, showInWeb, name, date)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })
    }
}