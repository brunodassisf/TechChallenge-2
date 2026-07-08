import { env } from "@/env";
import { Pool, PoolClient } from "pg";
import fs from "node:fs";
import path from "node:path";

const CONFIG = {
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: env.DB_PORT,
}

export class Database {
    private pool: Pool;
    private client: PoolClient | undefined;

    constructor() {
        this.pool = new Pool(CONFIG);
        this.connect();
    }

    private async connect() {
        try {
            this.client = await this.pool.connect();
            await this.runMigrations();
        } catch (error) {
            console.error(`Error connecting to database: ${error}`)

            throw new Error(`Error connecting to database: ${error}`)
        }
    }

    private async runMigrations() {
        const schemaPath = path.resolve(process.cwd(), "db/schema.sql");
        const schema = fs.readFileSync(schemaPath, "utf-8");

        await this.client?.query(schema);
    }

    get clientInstance() {
        return this.client;
    }
}

export const database = new Database();