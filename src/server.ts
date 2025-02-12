import express from "express";
import { PersistentHarasSystem } from "./PersistentHarasSystem";
import { HarasServer } from "./HarasServer";
import fileUpload from "express-fileupload";
import cors from "cors"
import logger from "../logger"
import { connectDatabase } from "./database";




const system = new PersistentHarasSystem();

const startServer = async () => {
        try {
            const connection = await connectDatabase();
            logger.info("Database connection established");
            
            //logger.info("Running migrations..");
            //connection.runMigrations();          
            
            logger.info("Start Server");
            await system.start();

            const server = express();

            //options for cors midddleware
            const options: cors.CorsOptions = {
                allowedHeaders: [
                    "Origin",
                    "X-Requested-With",
                    "Content-Type",
                    "Accept",
                    "X-Access-Token",
                ],
                credentials: true,
                methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
                origin: "*",
                preflightContinue: false,
            };

            const port = process.env.PORT;
            server.use(fileUpload());
            server.use(express.json());
            server.use(cors(options));
            new HarasServer(server, system);

            server.listen(port, async () => { 
                console.log(`server listen on port: ${port}`);
            });
        }
        catch (error) {
            logger.error(error);
            //await system.start();
        }
};

startServer();