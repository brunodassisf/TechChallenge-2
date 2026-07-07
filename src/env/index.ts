import "dotenv/config";
import { z } from "zod";
import process from "process";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid environment variables");
}

export const env = parsed.data;