import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    DB_USER: z.string(),
    DB_HOST: z.string(),
    DB_NAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_PORT: z.coerce.number().default(5432),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid environment variables");
}

export const env = parsed.data;