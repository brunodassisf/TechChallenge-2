import { CreatePostUseCase, GetPostsUseCase, GetPostByIdUseCase, UpdatePostUseCase, DeletePostUseCase, SearchPostUseCase } from "@/use-cases/use-post";
import { PostRepository } from "@/repositories/post.repository";
import { Post } from "@/entities/post.entity";

describe("CreatePostUseCase", () => {
    let postRepository: jest.Mocked<PostRepository>;
    let sut: CreatePostUseCase;

    beforeEach(() => {
        postRepository = {
            create: jest.fn(),
        } as unknown as jest.Mocked<PostRepository>;

        sut = new CreatePostUseCase(postRepository);
    });

    it("deve criar um post delegando para o repositório", async () => {
        const fakePost = new Post("Título", "Conteúdo", "author-id-1");
        postRepository.create.mockResolvedValueOnce(fakePost);

        const result = await sut.handler("Título", "Conteúdo", "author-id-1");

        expect(postRepository.create).toHaveBeenCalledWith(
            "Título",
            "Conteúdo",
            "author-id-1"
        );
        expect(postRepository.create).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakePost);
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        postRepository.create.mockRejectedValueOnce(new Error("Erro ao cadastrar post"));

        await expect(
            sut.handler("Título", "Conteúdo", "author-id-1")
        ).rejects.toThrow("Erro ao cadastrar post");
    });
});

describe("GetPostsUseCase", () => {
    let postRepository: jest.Mocked<PostRepository>;
    let sut: GetPostsUseCase;

    beforeEach(() => {
        postRepository = {
            findAll: jest.fn(),
        } as unknown as jest.Mocked<PostRepository>;

        sut = new GetPostsUseCase(postRepository);
    });

    it("deve listar todos post delegando para o repositório", async () => {
        const fakePosts = [new Post("Título", "Conteúdo", "author-id-1"), new Post("Título2", "Conteúdo2", "author-id-2")];
        postRepository.findAll.mockResolvedValue(fakePosts);

        const result = await sut.handler();

        expect(postRepository.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakePosts);
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        postRepository.findAll.mockRejectedValueOnce(new Error("Erro ao cadastrar post"));

        await expect(
            sut.handler()
        ).rejects.toThrow("Erro ao cadastrar post");
    });
});

describe("GetPostByIdUseCase", () => {
    let postRepository: jest.Mocked<PostRepository>;
    let sut: GetPostByIdUseCase;

    beforeEach(() => {
        postRepository = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<PostRepository>;
        sut = new GetPostByIdUseCase(postRepository);
    });

    it("deve listar todos post delegando para o repositório", async () => {
        const fakePost = new Post("Título", "Conteúdo", "author-id-1");
        postRepository.findById.mockResolvedValueOnce(fakePost);

        const result = await sut.handler("author-id-1");

        expect(postRepository.findById).toHaveBeenCalledWith("author-id-1");
        expect(postRepository.findById).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakePost);
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        postRepository.findById.mockRejectedValueOnce(new Error("Erro ao cadastrar post"));

        await expect(
            sut.handler("author-id-1")
        ).rejects.toThrow("Erro ao cadastrar post");
    });
});

describe("UpdatePostUseCase", () => {
    let postRepository: jest.Mocked<PostRepository>;
    let sut: UpdatePostUseCase;

    beforeEach(() => {
        postRepository = {
            updateById: jest.fn(),
        } as unknown as jest.Mocked<PostRepository>;
        sut = new UpdatePostUseCase(postRepository);
    });

    it("deve atualizar um post delegando para o repositório", async () => {
        const body = new Post("Título atualizado", "Conteúdo atualizado", "author-id-1");
        const fakePost = new Post("Título atualizado", "Conteúdo atualizado", "author-id-1");
        postRepository.updateById.mockResolvedValueOnce(fakePost);

        const result = await sut.handler("post-id-1", body);

        expect(postRepository.updateById).toHaveBeenCalledWith("post-id-1", body);
        expect(postRepository.updateById).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakePost);
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        const body = new Post("Título atualizado", "Conteúdo atualizado", "author-id-1");
        postRepository.updateById.mockRejectedValueOnce(new Error("Erro ao atualizar post"));

        await expect(
            sut.handler("post-id-1", body)
        ).rejects.toThrow("Erro ao atualizar post");
    });
});

describe("DeletePostUseCase", () => {
    let postRepository: jest.Mocked<PostRepository>;
    let sut: DeletePostUseCase;

    beforeEach(() => {
        // Mock manual: criamos um objeto com as mesmas assinaturas do
        // repositório real, mas cujo comportamento controlamos no teste.
        postRepository = {
            deleteById: jest.fn(),
        } as unknown as jest.Mocked<PostRepository>;
        sut = new DeletePostUseCase(postRepository);
    });

    it("deve deletar um post", async () => {
        postRepository.deleteById.mockResolvedValueOnce(undefined);

        const result = await sut.handler("post-id-1");

        expect(postRepository.deleteById).toHaveBeenCalledWith("post-id-1");
        expect(postRepository.deleteById).toHaveBeenCalledTimes(1);
        expect(result).toBeUndefined();
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        postRepository.deleteById.mockRejectedValueOnce(new Error("Erro ao deletar post"));

        await expect(
            sut.handler("post-id-1")
        ).rejects.toThrow("Erro ao deletar post");
    });
});

describe("SearchPostUseCase", () => {
    let postRepository: jest.Mocked<PostRepository>;
    let sut: SearchPostUseCase;

    beforeEach(() => {
        postRepository = {
            searchPosts: jest.fn(),
        } as unknown as jest.Mocked<PostRepository>;
        sut = new SearchPostUseCase(postRepository);
    });

    it("deve buscar um post", async () => {
        const fakePost = [new Post("Título", "Conteúdo", "author-id-1")];
        postRepository.searchPosts.mockResolvedValueOnce(fakePost);

        const result = await sut.handler("Título", undefined, undefined);

        expect(postRepository.searchPosts).toHaveBeenCalledWith("Título", undefined, undefined);
        expect(postRepository.searchPosts).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakePost);
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        postRepository.searchPosts.mockRejectedValueOnce(new Error("Erro ao deletar post"));

        await expect(
            sut.handler("post-id-1")
        ).rejects.toThrow("Erro ao deletar post");
    });
});
