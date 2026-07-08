import { Post } from "@/entities/post.entity";
import { PostRepository } from "@/repositories/post.repository";


export class CreatePostUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async handler(title: string, content: string, authorId: string): Promise<Post> {
        return this.postRepository.create(title, content, authorId);
    }
}