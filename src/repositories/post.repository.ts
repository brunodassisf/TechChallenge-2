import { Post } from "@/entities/post.entity";
import { database } from "@/lib/pg/db";

export class PostRepository {
    async create(title: string, content: string, authorId: string): Promise<Post> {

        const result  = await database.clientInstance?.query(
            `INSERT INTO post (title, content, author_id) VALUES ($1, $2, $3) RETURNING *`,
            [title, content, authorId]
        )

        if (result?.rows.length === 0) {
            throw new Error("Erro ao cadastrar post");
        }

        return result?.rows[0];
    }
}