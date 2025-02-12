import {HarasSystem} from "../HarasSystem";
import { ValueList } from "./ValueList";
import { ValuesLists } from "./ValuesLists";

export class ValuesListsServer{
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.post("/sex", async (request: any, response: any) => {
            try {
                const ValuesLists = this._system.valuesLists()
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter == "true" ? true: false;

                await ValuesLists.addSex(key, value, order, filter, description)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/fur", async (request: any, response: any) => {
            try {
                const ValuesLists = this._system.valuesLists()
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter == "true" ? true: false;
                await ValuesLists.addFur(key, value, order, filter, description)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/fileType", async (request: any, response: any) => {
            try {
                const ValuesLists = this._system.valuesLists()
                let {key, value, order, filter, description} = request.query
                if(filter === "true")
                    filter = true
                else
                    filter = false

                await ValuesLists.addFileType(key, value, order, filter, description)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/sex", async (request: any, response: any) => {
            try {
                const valuesLists = this._system.valuesLists()
                const valuesList : ValueList = request.body
                await valuesLists.updateSex(valuesList)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/fur", async (request: any, response: any) => {
            try {
                const valuesLists = this._system.valuesLists()
                const valuesList : ValueList = request.body
                await valuesLists.updateFur(valuesList)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/valuesList/:id", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()
                const id = request.params.id

                const result = await valuesList.findById("ValueList", id, () => {
                    throw new Error(ValuesLists.ERROR_NOT_FOUND)
                })

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/sex", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()

                const result = await valuesList.getAllSex()

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/fur", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()

                const result = await valuesList.getAllFur(false)

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/postType", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()
                let deleted =  request.query.deleted || false
                deleted = deleted == "true" ? true : false;
                const result = await valuesList.getAllPostType(deleted)

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/postType", async (request: any, response: any) => {
            try {
                const valuesLists = this._system.valuesLists()
                const valuesList : ValueList = request.body
                await valuesLists.updatePostType(valuesList)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/postStatus", async (request: any, response: any) => {
            try {
                const valuesLists = this._system.valuesLists()
                const valuesList : ValueList = request.body
                await valuesLists.updatePostStatus(valuesList)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/postStatus", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()
                let deleted =  request.query.deleted || false
                deleted = deleted == "true" ? true : false;
                const result = await valuesList.getAllPostStatus(deleted)

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/postStatus", async (request: any, response: any) => {
            try {
                const ValuesLists = this._system.valuesLists()
                
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter === "true" ? true : false;
                await ValuesLists.addPostStatus(key, value, order, filter, description)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/postType", async (request: any, response: any) => {
            try {
                const ValuesLists = this._system.valuesLists()
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter === "true" ? true : false;
                await ValuesLists.addPostType(key, value, order, filter, description)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.delete("/ValuesList/:id", async (request: any, response: any) => {
            try {
                const valuesLists = this._system.valuesLists()
                const id = request.params.id
                await valuesLists.delete(id)
                response.json({status: "OK"})
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/fileType", async (request: any, response: any) => {
            try {
                const valuesLists = this._system.valuesLists()

                const filetype = await valuesLists.getAllFileType()

                response.json(filetype)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/tasksType", async (request: any, response: any) => {
            try {
                const ValuesLists = this._system.valuesLists()
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter === "true" ? true : false;
                await ValuesLists.addTasksType(key, value, order, filter, description)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/tasksType", async (request: any, response: any) => {
            try {
               const valuesLists = this._system.valuesLists()
                const valuesList : ValueList = request.body
                await valuesLists.updateTasksType(valuesList)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/tasksType", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()
                let deleted =  request.query.deleted || false
                deleted = deleted == "true" ? true : false;
                const result = await valuesList.getAllTasksType(deleted)

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/clasificationname", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()

                const ValuesLists = this._system.valuesLists()
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter === "true" ? true : false;
                await ValuesLists.addClasificationName(key, value, order, filter, description)

                await this._system.commitTransaction()
                response.json({status: "OK"})
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.put("/clasificationname", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const valuesLists = this._system.valuesLists()
                const valuesList : ValueList = request.body
                await valuesLists.updateClasificationName(valuesList)

                await this._system.commitTransaction()
                response.json({status: "OK"})
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/clasificationname", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()
                let deleted =  request.query.deleted || false
                deleted = deleted == "true" ? true : false;
                const result = await valuesList.getAllClasificationName(deleted)

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/interventionType", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()

                const valuesLists = this._system.valuesLists()
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter === "true" ? true : false;
                await valuesLists.addInterventionType(key, value, order, filter, description)

                await this._system.commitTransaction()
                response.json({status: "OK"})
            }
            catch (error){
                await this._system.rollbackTransaction()
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/interventionType", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()
                let deleted =  request.query.deleted || false
                deleted = deleted == "true" ? true : false;
                const result = await valuesList.getAllByType("InterventionType",deleted)

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.post("/jumpValues", async (request: any, response: any) => {
            try {
                const ValuesLists = this._system.valuesLists()
                // eslint-disable-next-line prefer-const
                let {key, value, order, filter, description} = request.body
                filter = filter == "true" ? true: false;
                await ValuesLists.addJumpValues(key, value, order, filter, description)

                response.json({status: "OK"})
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })

        server.get("/jumpValues", async (request: any, response: any) => {
            try {
                const valuesList = this._system.valuesLists()
                let deleted =  request.query.deleted?? false
                deleted = deleted == "true" ? true : false;
                const result = await valuesList.getAllJump(deleted)

                response.json(result)
            }
            catch (error){
                response.status(400).json({msg: error.message})
            }
        })
    }
}