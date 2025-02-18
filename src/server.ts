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
            
            logger.info("Start Server");
            await system.start();

            //logger.info("Running migrations..");
            //connection.runMigrations();
            
            //const data = await initializeData();            

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

async function initializeData() {
    try {
        logger.info("Comenzando transacción para carga inicial de datos...");
        const locations = system.locations();
        const horses = system.horses();
        const peoples = system.peoples();
        const valuesList = system.valuesLists();

        const sexes = [
            { key: "M", value: "mare", order: 1, filter: true, description: "" },
            { key: "S", value: "stallion", order: 1, filter: true, description: "" },
            { key: "C", value: "castrated", order: 3, filter: true, description: "" },
            { key: "A", value: "A Definir", order: 4, filter: true, description: "sexo a definir" }
        ];

        for (const sexData of sexes) {
            await valuesList.addSex(sexData.key, sexData.value, sexData.order, sexData.filter, sexData.description);
            logger.info(`Agregado Sexo: ${sexData.key}`);
        }

        const furs = [
            { key: "ALAZÁN", value: "Alazán", order: 1, filter: true, description: "" },
            { key: "ZAINO", value: "Zaino", order: 2, filter: true, description: "" },
            { key: "TORDILLO", value: "Tordillo", order: 3, filter: true, description: "" },
            { key: "FA", value: "A definir", order: 4, filter: true, description: "Pelaje a Definir" },
        ];

        for (const furData of furs) {
            await valuesList.addFur(furData.key, furData.value, furData.order, furData.filter, furData.description);
            logger.info(`Agregado Pelaje: ${furData.key}`);
        }

        const postTypes = [
            { key: "P", value: "published", order: 1, filter: false, description: "published post"},
            { key: "D", value: "draft", order: 2, filter: false, description: "drafted post"},
            { key: "N", value: "news", order: 3, filter: false, description: "news type"},
            { key: "E", value: "event", order: 4, filter: true, description: "event type"},
        ]

        for (const postTypesData of postTypes) {
            await valuesList.addPostType(postTypesData.key, postTypesData.value, postTypesData.order, postTypesData.filter, postTypesData.description);
            logger.info(`Agregado postType: ${postTypesData.key}`);
        }

        const fileTypes = [
            { key: "PHOTO", value: "png,jpg,jpeg,webp", order: 1, filter: false, description: "PHOTO"},
            { key: "VIDEO", value: "mp4,mov,wmv,avi,mkv,3gp", order: 2, filter: false, description: "VIDEO"},
            { key: "DOCUMENT", value: "pdf,doc,docx,xls,xlsx,txt", order: 3, filter: false, description: "DOCUMENT"},
            { key: "UNKNOW", value: "unknown", order: 4, filter: false, description: "''"},
        ]

        for (const fileTypesData of fileTypes) {
            await valuesList.addFileType(fileTypesData.key, fileTypesData.value, fileTypesData.order, fileTypesData.filter, fileTypesData.description);
            logger.info(`Agregado fileType: ${fileTypesData.key}`);
        }

        const taskTypes = [
            {key: "G", value: "General", order: 1, filter: false, description: "General"},
            {key: "COM", value: "Competition", order: 2, filter: false, description: "Competition"},
            {key: "ED", value: "Education", order: 3, filter: false, description: "Education"},
            {key: "H", value: "chape", order: 4, filter: false, description: "chape"},
            {key: "V", value: "Vaccination", order: 5, filter: false, description: "Vaccination"},
            {key: "DE", value: "deworming", order: 6, filter: false, description: "deworming"},
            {key: "R", value: "review", order: 7, filter: false, description: "review"},
            {key: "REP", value: "reproduction", order: 8, filter: false, description: "reproduction"},
        ]

        for (const taskTypesData of taskTypes) {
            await valuesList.addTasksType(taskTypesData.key, taskTypesData.value, taskTypesData.order, taskTypesData.filter, taskTypesData.description);
            logger.info(`Agregado taskType: ${taskTypesData.key}`);
        }
        
        const clasifications = [
            {key: "0", value: "Estado Inicial", order: 1, filter: true, description: "Estado inicial"},
            {key: "1", value: "Yeguas Apto servicio", order: 2, filter: true, description: "Yeguas Apto servicio"},
            {key: "2", value: "Yegua Donante", order: 3, filter: true, description: "Yegua Donante"},
            {key: "3", value: "Yegua Madre", order: 4, filter: true, description: "Yegua Madre"},
            {key: "4", value: "Yegua A Transferir", order: 5, filter: true, description: "Yegua A Transferir"},
            {key: "5", value: "Yegua Preñada", order: 6, filter: true, description: "Yegua Preñada"},
            {key: "6", value: "Yegua con Potrillo al Pie", order: 7, filter: true, description: "Yegua con Potrillo al Pie"},
            {key: "7", value: "Proceso de doma", order: 8, filter: true, description: "Proceso de doma"},
            {key: "8", value: "Padrillo Pajuelas", order: 9, filter: true, description: "Apto Servicio Pajuela"},
            {key: "9", value: "Padrillo Servicio Natural", order: 10, filter: true, description: "Apto Servicio Natural"},
            {key: "10", value: "Yegua inseminada", order: 11, filter: true, description: "Yegua inseminada"},
            {key: "11", value: "Yegua Transferida", order: 12, filter: true, description: "Yegua Transferida"},
            {key: "12", value: "Training", order: 13, filter: true, description: "Training"},
            {key: "13", value: "Jubilado", order: 14, filter: true, description: "Jubilado"},
            {key: "14", value: "Training Descanso", order: 15, filter: true, description: "Training Descanso"},
            {key: "15", value: "Vendido", order: 16, filter: true, description: "Vendido"},
            {key: "16", value: "Yegua Receptora", order: 17, filter: true, description: "Yegua Receptora"},
            {key: "17", value: "Fallecido", order: 18, filter: true, description: "Fallecido"},
            {key: "18", value: "Trabajo", order: 19, filter: true, description: "Trabajo"},
        ]

        for (const clasificationsData of clasifications) {
            await valuesList.addClasificationName(clasificationsData.key, clasificationsData.value, clasificationsData.order, clasificationsData.filter, clasificationsData.description);
            logger.info(`Agregado taskType: ${clasificationsData.key}`);
        }

        const interventionTypes = [
            {key: "R", value: "radiography", order: 1, filter: false, description: "radiography"},
            {key: "V", value: "vaccination", order: 2, filter: false, description: "vaccination"},
            {key: "S", value: "surgical", order: 3, filter: false, description: "surgical"},
            //{key: "DE", value: "deworming", order: 4, filter: false, description: "deworming"},
            {key: "H", value: "chape", order: 5, filter: false, description: "chape"},
            {key: "AS", value: "Resultados de Laboratorio", order: 6, filter: false, description: "Resultado de Laboratorio"},
            {key: "F", value: "fibroscopy", order: 7, filter: false, description: "fibroscopy"},
            {key: "O", value: "odontology", order: 8, filter: false, description: "Odontología"},
            {key: "E", value: "ultrasound", order: 9, filter: false, description: "Ecografía"},
            {key: "I", value: "infiltration", order: 10, filter: false, description: "Infiltración"},
            {key: "PP", value: "radiography", order: 11, filter: false, description: "Radiography"},
            {key: "R", value: "platelet rich plasma", order: 12, filter: false, description: "Plasma rico en plaquetas"},
            {key: "OS", value: "Osteopatía", order: 13, filter: false, description: "Osteopatía"},
            {key: "Q", value: "Quiropraxia", order: 14, filter: false, description: "Quiropraxia"},
            {key: "RG", value: "Revisión General", order: 15, filter: false, description: "Revisión General"},
        ]

        for (const interventionTypesData of interventionTypes) {
            await valuesList.addInterventionType(interventionTypesData.key, interventionTypesData.value, interventionTypesData.order, interventionTypesData.filter, interventionTypesData.description);
            logger.info(`Agregado interventionTypes: ${interventionTypesData.key}`);
        }

        await peoples.addPeople("Juan", "Zabala", "11111111", 1, "jzabala@grupo.com");
        await peoples.addVeterinarian("Bernardo", "Nacional", "11111112", "1002", 2, "bnacional@grupo.com");
    
        await system.commitTransaction();
        logger.info("Datos iniciales cargados exitosamente.");
    } catch (error) {
        logger.error("Error en la carga de datos iniciales:", error);
        await system.rollbackTransaction();
    }
}

startServer();