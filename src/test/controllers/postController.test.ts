import express from "express";
import { create, getPosts, getPostById, updatePost, deletePost, searchPost } from "@/controllers/postController";
import { CreatePostUseCase, GetPostsUseCase, GetPostByIdUseCase, UpdatePostUseCase, DeletePostUseCase, SearchPostUseCase } from "@/use-cases/use-post";
import { Post } from "@/entities/post.entity";
import { Author } from "@/entities/author.entity";

jest.mock("@/repositories/post.repository");
jest.mock("@/use-cases/use-post");

function makeRes() {
    const res = {} as express.Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("postController.create", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve cadastrar um post e retornar 201", async () => {
        const fakePost = new Post("Test", "lorem lorem...", "b8dabb62-7416-4a85-860b-15a0abac2147");
        jest.spyOn(CreatePostUseCase.prototype, "handler").mockResolvedValueOnce(fakePost);

        const req = { body: { title: "Post teste", content: "email@teste.com", authorId: "b8dabb62-7416-4a85-860b-15a0abac2147" } } as express.Request;
        const res = makeRes();

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Post cadastrado com sucesso!",
            data: fakePost,
        });
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(CreatePostUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = { body: { title: "Post teste", content: "email@teste.com", authorId: "b8dabb62-7416-4a85-860b-15a0abac2147" } } as express.Request;
        const res = makeRes();

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao cadastrar post" });
    });
});

describe("postController.getPosts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve listar os posts e retornar 200", async () => {
        const fakeAuthor: Author = { id: "b8dabb62-7416-4a85-860b-15a0abac2147", name: "name", email: "email" };
        const fakePost = new Post("Test", "lorem lorem...", fakeAuthor.id as string);
        fakePost.author = fakeAuthor;
        const fakePosts = [fakePost];

        jest.spyOn(GetPostsUseCase.prototype, "handler").mockResolvedValueOnce(fakePosts);

        const req = {} as express.Request;
        const res = makeRes();

        await getPosts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakePosts);
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(GetPostsUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = {} as express.Request;
        const res = makeRes();

        await getPosts(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar posts" });
    });
});

describe("postController.getPostById", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve listar os posts e retornar 200", async () => {
        const fakeAuthor: Author = { id: "b8dabb62-7416-4a85-860b-15a0abac2147", name: "name", email: "email" };
        const fakePost = new Post("Test", "lorem lorem...", fakeAuthor.id as string);
        fakePost.author = fakeAuthor;

        jest.spyOn(GetPostByIdUseCase.prototype, "handler").mockResolvedValueOnce(fakePost);

        const req = { params: { id: 'b5334f9c-a0c6-4cce-b7b7-0e88d6d0004' } } as unknown as express.Request;
        const res = makeRes();

        await getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakePost);
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(GetPostByIdUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = { params: { id: 'b5334f9c-a0c6-4cce-b7b7-0e88d6d0004a' } } as unknown as express.Request;
        const res = makeRes();

        await getPostById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar post" });
    });
});

describe("postController.updatePost", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve atualizar e retornar o post e retornar 200", async () => {
        const fakeAuthor: Author = { id: "b8dabb62-7416-4a85-860b-15a0abac2147", name: "name", email: "email" };
        const fakePost = new Post("Test", "lorem lorem...", fakeAuthor.id as string);
        fakePost.author = fakeAuthor;

        const fakePostResult = new Post("Test2", "lorem lorem...", fakeAuthor.id as string);

        jest.spyOn(UpdatePostUseCase.prototype, "handler").mockResolvedValueOnce(fakePostResult);

        const req = {
            params: { id: "b5334f9c-a0c6-4cce-b7b7-0e88d6d0004" },
            body: { title: "Test", content: "email@teste.com" },
        } as unknown as express.Request;
        const res = makeRes();

        await updatePost(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post atualizado com sucesso!', data: fakePostResult });
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(UpdatePostUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = {
            params: { id: "b5334f9c-a0c6-4cce-b7b7-0e88d6d0004" },
            body: { title: "Test", content: "email@teste.com", authorId: "b8dabb62-7416-4a85-860b-15a0abac2147" },
        } as unknown as express.Request;
        const res = makeRes();

        await updatePost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao atualizar post" });
    });
});

describe("postController.deletePost", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve deletar o post e retornar 200", async () => {

        jest.spyOn(DeletePostUseCase.prototype, "handler").mockResolvedValueOnce();

        const req = {
            params: { id: "b5334f9c-a0c6-4cce-b7b7-0e88d6d0004" }
        } as unknown as express.Request;
        const res = makeRes();

        await deletePost(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post deletado com sucesso!' });
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(DeletePostUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = {
            params: { id: "b5334f9c-a0c6-4cce-b7b7-0e88d6d0004" }
        } as unknown as express.Request;
        const res = makeRes();

        await deletePost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao deletar post" });
    });
});

describe("postController.searchPost", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve usar os paramêtros da requisição para buscar posts e retornar 200", async () => {
        const fakePosts = [new Post("Test", "lorem lorem...", "b8dabb62-7416-4a85-860b-15a0abac2147")];

        jest.spyOn(SearchPostUseCase.prototype, "handler").mockResolvedValueOnce(fakePosts);

        const req = {
            query: { title: "Test" }
        } as unknown as express.Request;
        const res = makeRes();

        await searchPost(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakePosts);
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(SearchPostUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = {
            query: { title: "Test" }
        } as unknown as express.Request;
        const res = makeRes();

        await searchPost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar posts" });
    });
});

