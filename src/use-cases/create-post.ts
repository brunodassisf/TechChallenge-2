import { Post } from "@/entities/post.entity";
import { PostRepository } from "@/repositories/post.repository";


export class CreatePostUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async handler(title: string, content: string, authorId: string): Promise<Post> {
        return this.postRepository.create(title, content, authorId);
    }
}

export class GetPostsUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async handler(): Promise<Post[]> {
        return this.postRepository.findAll();
    }
}

export class GetPostByIdUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async handler(id: string): Promise<Post> {
        return this.postRepository.findById(id);
    }
}

export class UpdatePostUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async handler(id: string, body: Post): Promise<Post> {
        return this.postRepository.updateById(id, body);
    }
}

export class DeletePostUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async handler(id: string) {
        return this.postRepository.deleteById(id);
    }
}

export class SearchPostUseCase {
    constructor(private readonly postRepository: PostRepository) { }

    async handler(title?: string, content?: string, author?: string) {
        return this.postRepository.searchPosts(title, content, author);
    }
}