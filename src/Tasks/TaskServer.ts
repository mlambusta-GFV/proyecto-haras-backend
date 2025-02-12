import { HarasSystem } from "../HarasSystem";
import { Task } from "./Task";
import { Tasks } from "./Tasks";

export class TaskServer{
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem){
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {

        server.post("/tasks", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const tasks = this._system.tasks()
                const { title, typeId, description , startDate, endDate, horseId, createdTaskUserId, relatedTaskUsers } = request.body
                await tasks.add(title, typeId, description , startDate, endDate, horseId, createdTaskUserId, relatedTaskUsers)
                await this._system.commitTransaction()
                response.json({ status: "OK" })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/tasks", async (request: any, response: any) => {
            try {
                const tasks = this._system.tasks()

                let {page, limit, search, order, filter} = request.query
                search = search === undefined ? "" : search;
                filter = filter !== undefined ? JSON.parse(filter) : [{}];
                order = order !== undefined ? JSON.parse(order) : { field: "startDate", order: "ASC" };
                page = page === undefined ? 0 : page;
                limit = limit === undefined ? 50 : limit;

                const allTasks = await tasks.getAll(search, filter, page, limit, order);
                response.json({
                    "total": allTasks[1],
                    "page": page,
                    "rows": allTasks[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/tasks/:id", async (request: any, response: any) => {
            try {
                const tasks = this._system.tasks()
                const id = request.params.id
                const task = await tasks.findById(id, () => { throw new Error(Tasks.ERROR_POST_NOT_FOUND) })

                response.json(task)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/tasks/horse/:horseid", async (request: any, response: any) => {
            try {
                let {page, limit} = request.query
                const tasks = this._system.tasks()
                const horseId = request.params.horseid
                page = page === undefined ? 0 : page;
                limit = limit === undefined ? 50 : limit;

                const result = await tasks.findByHorse(horseId, page, limit, () => {
                    throw new Error(Tasks.ERROR_POST_NOT_FOUND)
                })

                response.json({
                    "total": result[1],
                    "page": page,
                    "rows": result[0]
                })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/tasks/creator/:userid", async (request: any, response: any) => {
            try {
                const tasks = this._system.tasks()
                const userid = request.params.userid
                const result = await tasks.findByCreateTaskUser(userid, () => { throw new Error(Tasks.ERROR_POST_NOT_FOUND) })

                response.json(result)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.delete("/tasks/:id", async (request: any, response: any) => {
            try {
                const tasks = this._system.tasks()
                const idTasks = request.params.id
                tasks.delete(idTasks)

                response.json({ status: "OK" })
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.put("/tasks/:id", async (request: any, response: any) => {
            try {
                const tasks = this._system.tasks();
                const id = request.params.id;
                const {title,typeId,description,startDate,endDate,horseId,createdTaskUserId,relatedTaskUsers} = request.body;
                
                const editedTasks = await tasks.update(id,title,typeId,description,startDate,endDate,horseId,createdTaskUserId,relatedTaskUsers)

                response.json(editedTasks)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })
    }
}