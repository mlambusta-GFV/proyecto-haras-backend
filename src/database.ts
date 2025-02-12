import "reflect-metadata";
import { createConnection } from "typeorm";
import { config } from "dotenv";
import * as path from "path";

config({ path: ".env.production" });

export const connectDatabase = async () => {
    return await createConnection({
        type: process.env.TYPEORM_CONNECTION as "mysql",
        host: process.env.TYPEORM_HOST,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        port: parseInt(process.env.TYPEORM_PORT || "3306"),
        logging: process.env.TYPEORM_LOGGING === "true",
        dropSchema: process.env.TYPEORM_DROP_SCHEMA === "true",
        entities: ["src/**/*.ts"],
        migrationsRun: true,
        migrations: [path.join(__dirname, process.env.TYPEORM_MIGRATIONS || "migration/*.ts")],         
        synchronize: process.env.TYPEORM_SYNCHRONIZE === "false",
        cli: {
            migrationsDir: "src/migration",
        },
    });
};
