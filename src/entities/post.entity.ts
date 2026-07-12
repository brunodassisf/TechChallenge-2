import { Author } from "@/entities/author.entity";

export class Post {
    id?: string;
    title: string;
    content: string;
    authorId?: string;
    author?: Author;

    constructor(title: string, content: string, authorId?: string, author?: Author) {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.author = author;
    }
}