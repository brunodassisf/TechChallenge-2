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
    // O Postgres gerenciado do Render exige SSL; localmente (docker-compose)
    // e nos testes (Testcontainers) não há SSL disponível, por isso é opt-in
    // via DB_SSL em vez de depender de NODE_ENV.
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
}

export class Database {
    private pool: Pool;
    private client: PoolClient | undefined;
    readonly ready: Promise<void>;

    constructor() {
        this.pool = new Pool(CONFIG);
        this.ready = this.connect();
    }

    private async connect() {
        try {
            this.client = await this.pool.connect();
            await this.runMigrations();
        } catch (error) {
            console.error(`Error connecting to database: ${error}`)

            throw new Error(`Error connecting to database: ${error}`, { cause: error })
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

    async close() {
        this.client?.release();
        await this.pool.end();
    }
}

export const database = new Database();