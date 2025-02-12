import { HarasSystem } from "../HarasSystem";
import { Post } from "./Post";
import { Posts } from "./Posts";

export class PostServer{
    private _system: HarasSystem;

    constructor(server: any, system: HarasSystem) {
        this._system = system
        this.registerOn(server)
    }

    private async registerOn(server: any) {
        server.post("/posts", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const posts = this._system.posts()
                const { title, type, author, subtitle, content, status, epigraph, slug, tags, idhorse, postDate } = request.body
                await posts.add(title, type, author, subtitle, content, postDate, status, epigraph, slug, tags, idhorse)
                await this._system.commitTransaction()
                response.json({ status: "OK" })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/posts", async (request: any, response: any) => {
            try {
                const posts = this._system.posts()

                const allPosts = await posts.getAll();
                response.json(allPosts)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/posts/:id", async (request: any, response: any) => {
            try {
                const posts = this._system.posts()
                const id = request.params.id
                const post = await posts.findById(id, () => { throw new Error(Posts.ERROR_POST_NOT_FOUND) })

                response.json(post)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.get("/posts/horse/:horseid", async (request: any, response: any) => {
            try {
                const posts = this._system.posts()
                const horseId = request.params.horseid
                const result = await posts.findByHorse(horseId, () => { throw new Error(Posts.ERROR_POST_NOT_FOUND) })

                response.json(result)
            }
            catch (error) {
                response.status(400).json({ msg: error.message })
            }
        })

        server.delete("/posts/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const posts = this._system.posts()
                const idDocument = request.params.id
                posts.delete(idDocument)
                await this._system.commitTransaction()
                response.json({ status: "OK" })
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })

        server.put("/posts/:id", async (request: any, response: any) => {
            try {
                await this._system.beginTransaction()
                const posts = this._system.posts()
                const post: Post = request.query
                const editedPost = await posts.update(post)
                await this._system.commitTransaction()
                response.json(editedPost)
            }
            catch (error) {
                await this._system.rollbackTransaction()
                response.status(400).json({ msg: error.message })
            }
        })
    }
}