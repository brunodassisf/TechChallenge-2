import { Post } from "@/entities/post.entity";
import { PostNotFoundError } from "@/errors/post-not-found.error";
import { database } from "@/lib/pg/db";

export class PostRepository {
    async create(title: string, content: string, authorId: string): Promise<Post> {

        const result = await database.clientInstance?.query(
            `INSERT INTO post (title, content, author_id) VALUES ($1, $2, $3) RETURNING *`,
            [title, content, authorId]
        )

        if (result?.rows.length === 0) {
            throw new Error("Erro ao cadastrar post");
        }

        return result?.rows[0];
    }

    async findAll(): Promise<Post[]> {
        const result = await database.clientInstance?.query(
            `SELECT
                post.id,
                post.title,
                post.content,
                json_build_object('id', author.id, 'name', author.name, 'email', author.email) AS author
            FROM post
            JOIN author ON author.id = post.author_id`
        )
        return result?.rows as Post[];
    }

    async findById(id: string): Promise<Post> {
        const result = await database.clientInstance?.query(
            `SELECT
                post.id,
                post.title,
                post.content,
                json_build_object('id', author.id, 'name', author.name, 'email', author.email) AS author
            FROM post
            JOIN author ON author.id = post.author_id
            WHERE post.id = $1`,
            [id]
        )

        if (result?.rows.length === 0) {
            throw new PostNotFoundError();
        }

        return result?.rows[0] as Post;
    }

    async updateById(id: string, body: Post): Promise<Post> {
        const result = await database.clientInstance?.query(
            `UPDATE post SET title = $1, content = $2, author_id = $3 WHERE id = $4 RETURNING *`,
            [body.title, body.content, body.authorId, id]
        )

        if (result?.rows.length === 0) {
            throw new PostNotFoundError();
        }

        return result?.rows[0] as Post;
    }

    async deleteById(id: string) {
        const result = await database.clientInstance?.query(
            `DELETE FROM post WHERE id = $1 RETURNING id`,
            [id]
        )

        if (result?.rows.length === 0) {
            throw new PostNotFoundError();
        }

        return;
    }


    async searchPosts(title?: string, content?: string, author?: string): Promise<Post[]> {
        const conditions: string[] = [];
        const params: string[] = [];

        if (title) {
            params.push(`%${title}%`);
            conditions.push(`post.title ILIKE $${params.length}`);
        }

        if (content) {
            params.push(`%${content}%`);
            conditions.push(`post.content ILIKE $${params.length}`);
        }

        if (author) {
            params.push(`%${author}%`);
            conditions.push(`(author.name ILIKE $${params.length} OR author.email ILIKE $${params.length})`);
        }

        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        const result = await database.clientInstance?.query(
            `SELECT
                post.id,
                post.title,
                post.content,
                json_build_object('id', author.id, 'name', author.name, 'email', author.email) AS author
            FROM post
            JOIN author ON author.id = post.author_id
            ${whereClause}`,
            params
        )

        return result?.rows as Post[];

    }
}