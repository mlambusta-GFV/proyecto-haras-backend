import express from "express";
import { PersistentHarasSystem } from "./PersistentHarasSystem";
import { HarasServer } from "./HarasServer";
import fileUpload from "express-fileupload";
import cors from "cors"
import logger from "../logger"
import { connectDatabase } from "./database";
import { Interventions } from "./ClinicHistory/Interventions";




const system = new PersistentHarasSystem();

const startServer = async () => {
        try {
            const connection = await connectDatabase();
            logger.info("Database connection established");
            
            logger.info("Starting Express Server");
            await system.start();

            //logger.info("Running migrations..");
            //connection.runMigrations();
            
            //await initializeData();            

            const server = express();

            //options for cors middleware
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
        logger.info("Starting transaction for initial data load...");
        const locations = system.locations();
        const horses = system.horses();
        const peoples = system.peoples();
        const valuesList = system.valuesLists();

        const sexes = [
            { key: "M", value: "mare", order: 1, filter: true, description: "Female horse" },
            { key: "S", value: "stallion", order: 1, filter: true, description: "Male breeding horse" },
            { key: "C", value: "Gelding", order: 3, filter: true, description: "Gelding male horse" },
            { key: "U", value: "Undefined", order: 4, filter: true, description: "To be determined" }
        ];

        const furs = [
            { key: "CHESTNUT", value: "Chestnut", order: 1, filter: true, description: "" },
            { key: "BAY", value: "Bay", order: 2, filter: true, description: "" },
            { key: "GRAY", value: "Gray", order: 3, filter: true, description: "" },
            { key: "UNDEFINED", value: "Undefined", order: 4, filter: true, description: "To be determined" },
        ];

        const postTypes = [
            { key: "P", value: "Published", order: 1, filter: false, description: "published post"},
            { key: "D", value: "Draft", order: 2, filter: false, description: "Draft post"},
            { key: "N", value: "News", order: 3, filter: false, description: "News type"},
            { key: "E", value: "Event", order: 4, filter: true, description: "Event type"},
        ]

        const fileTypes = [
            { key: "PHOTO", value: "png,jpg,jpeg,webp", order: 1, filter: false, description: "PHOTO"},
            { key: "VIDEO", value: "mp4,mov,wmv,avi,mkv,3gp", order: 2, filter: false, description: "VIDEO"},
            { key: "DOCUMENT", value: "pdf,doc,docx,xls,xlsx,txt", order: 3, filter: false, description: "DOCUMENT"},
            { key: "UNKNOW", value: "unknown", order: 4, filter: false, description: "''"},
        ]

        const taskTypes = [
            {key: "GRAL", value: "General", order: 1, filter: false, description: "General task"},
            {key: "COMP", value: "Competition", order: 2, filter: false, description: "Competition-related task"},
            {key: "TRAIN", value: "Training", order: 3, filter: false, description: "Training and Education"},
            {key: "HOOF_CARE", value: "Hoof care", order: 4, filter: false, description: "Hoof trimming and maintenance"},
            {key: "VACC", value: "Vaccination", order: 5, filter: false, description: "Immunization schedule"},
            {key: "DEWORM", value: "Deworming", order: 6, filter: false, description: "Parasite control treatment"},
            {key: "REVIEW", value: "Review", order: 7, filter: false, description: "Routine health examination"},
            {key: "BREEDING", value: "Breeding", order: 8, filter: false, description: "Reproduction and breeding management"},
        ]
       
        const classifications = [
            {key: "0", value: "Initial State", order: 1, filter: true, description: "Initial State"},
            {key: "1", value: "Mares Ready for Service", order: 2, filter: true, description: "Mares ready for breeding service"},
            {key: "2", value: "Donor Mare", order: 3, filter: true, description: "Mare used for embryo donation"},
            {key: "3", value: "Broodmare", order: 4, filter: true, description: "Mare designated for breeding"},
            {key: "4", value: "Mare for Transfer", order: 5, filter: true, description: "Mare pending ownership transfer"},
            {key: "5", value: "Pregnant Mare", order: 6, filter: true, description: "Mare confirmed pregnant"},
            {key: "6", value: "Mare whit Foal at Side", order: 7, filter: true, description: "Mare nursing a foal"},
            {key: "7", value: "Starting Process", order: 8, filter: true, description: "Horse undergoing initial training"},
            {key: "8", value: "Stallion for Semen Collection", order: 9, filter: true, description: "Stallion used for artificial insemination"},
            {key: "9", value: "Stallion for Natural Service", order: 10, filter: true, description: "Stallion used for live cover breeding"},
            {key: "10", value: "Inseminated Mare", order: 11, filter: true, description: "Mare that has been artificially inseminated"},
            {key: "11", value: "Transferred Mare", order: 12, filter: true, description: "Mare transferred to a new location/owner"},
            {key: "12", value: "Training", order: 13, filter: true, description: "Horse actively in training"},
            {key: "13", value: "Retired", order: 14, filter: true, description: "Horse retired from activity"},
            {key: "14", value: "Training Break", order: 15, filter: true, description: "Horse temporarily on rest from training"},
            {key: "15", value: "Sold", order: 16, filter: true, description: "Horse sold and no longer in the program"},
            {key: "16", value: "Recipient Mare", order: 17, filter: true, description: "Mare used to carry an embryo"},
            {key: "17", value: "Deceased", order: 18, filter: true, description: "Horse has passed away"},
            {key: "18", value: "Work Horse", order: 19, filter: true, description: "Horse used for labor or utility purposes"},
        ]

        const interventionTypes = [
            {key: "XRAY", value: "Radiography", order: 1, filter: false, description: "X-ray imaging for diagnosis"},
            {key: "VACC", value: "Vaccination", order: 2, filter: false, description: "Immunization and disease prevention"},
            {key: "SURG", value: "Surgical Procedure", order: 3, filter: false, description: "Surgical intervention"},
            {key: "HOOF", value: "Hoof Care", order: 5, filter: false, description: "Hoof trimming and maintenance"},
            {key: "LAB_RESULTS", value: "Labotary Results", order: 6, filter: false, description: "Analysis of blood, urine, or tissue samples"},
            {key: "FIBROSCOPY", value: "Fibroscopy", order: 7, filter: false, description: "Internal examination with an fibroscope"},
            {key: "DENTAL", value: "Dental Care", order: 8, filter: false, description: "Odontological treatment and maintenance"},
            {key: "ULTRASOUND", value: "Ultrasound", order: 9, filter: false, description: "Ultrasound imaging for medical assessment"},
            {key: "INFILTRATION", value: "Infiltration Therapy", order: 10, filter: false, description: "Injection-based treatment"},
            {key: "PRP", value: "Platelet-Rich Plasma", order: 12, filter: false, description: "Regenerative therapy using plasma"},
            {key: "OSTEO", value: "Osteopathy", order: 13, filter: false, description: "Manual therapy for musculoskeletal health"},
            {key: "CHIROPRACTIC", value: "Chiropractic", order: 14, filter: false, description: "Spinal and joint realignment therapy"},
            {key: "GEN_REVIEW", value: "General Check-Up", order: 15, filter: false, description: "Routine health examination"},
        ]

        await Promise.all([
            sexes.map(sex => valuesList.addSex(sex.key, sex.value, sex.order, sex.filter, sex.description)),
            furs.map(fur => valuesList.addFur(fur.key, fur.value, fur.order, fur.filter, fur.description)),
            postTypes.map(postTypes => valuesList.addPostType(postTypes.key, postTypes.value, postTypes.order, postTypes.filter, postTypes.description)),
            fileTypes.map(filesTypes => valuesList.addFileType(filesTypes.key, filesTypes.value, filesTypes.order, filesTypes.filter, filesTypes.description)),
            taskTypes.map(taskTypes => valuesList.addTasksType(taskTypes.key, taskTypes.value, taskTypes.order, taskTypes.filter, taskTypes.description)),
            classifications.map(classifications => valuesList.addClasificationName(classifications.key, classifications.value, classifications.order, classifications.filter, classifications.description)),
            interventionTypes.map(interventionsTypes => valuesList.addInterventionType(interventionsTypes.key, interventionsTypes.value, interventionsTypes.order, interventionsTypes.filter, interventionsTypes.description))
        ]);
        await peoples.addPeople("Juan", "Zabala", "11111111", 1, "jzabala@grupo.com");
        await peoples.addVeterinarian("Bernardo", "Espina", "11111112", "1002", 2, "bspina@grupo.com");
    
        await system.commitTransaction();
        logger.info("Initial data succesfully loaded");
    } catch (error) {
        logger.error("Error loading initial data:", error);
        await system.rollbackTransaction();
    }
}

startServer();