import { Author } from "@/entities/author.entity";
import { database } from "@/lib/pg/db";

export class AuthorRepository {
    async create({ name, email }: Author): Promise<Author | undefined> {

        const result = await database.clientInstance?.query(
            `INSERT INTO author (name, email) VALUES ($1, $2) RETURNING *`,
            [name, email]
        )

        if (result?.rows.length === 0) {
            return undefined;
        }

        return result?.rows[0];
    }


    async getAuthors(): Promise<Author[]> {
        const result = await database.clientInstance?.query(
            `SELECT * FROM author`
        );

        return result?.rows as Author[];

    }
}