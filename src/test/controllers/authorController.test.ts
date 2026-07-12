import express from "express";
import { create, getAuthors } from "@/controllers/authorController";
import { CreateAuthorUseCase, GetAuthorUseCase } from "@/use-cases/use-author";
import { Author } from "@/entities/author.entity";

jest.mock("@/repositories/author.repository");
jest.mock("@/use-cases/use-author");

function makeRes() {
    const res = {} as express.Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("authorController.create", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve cadastrar um autor e retornar 201", async () => {
        const fakeAuthor = new Author("Nome", "email@teste.com");
        jest.spyOn(CreateAuthorUseCase.prototype, "handler").mockResolvedValueOnce(fakeAuthor);

        const req = { body: { name: "Nome", email: "email@teste.com" } } as express.Request;
        const res = makeRes();

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Autor cadastrado com sucesso!",
            data: fakeAuthor,
        });
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(CreateAuthorUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = { body: { name: "Nome", email: "email@teste.com" } } as express.Request;
        const res = makeRes();

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao cadastrar autor" });
    });
});

describe("authorController.getAuthors", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve retornar a lista de autores", async () => {
        const fakeAuthors = [new Author("Nome", "email@teste.com")];
        jest.spyOn(GetAuthorUseCase.prototype, "handler").mockResolvedValueOnce(fakeAuthors);

        const req = {} as express.Request;
        const res = makeRes();

        await getAuthors(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(fakeAuthors);
    });

    it("deve retornar 500 se o use case falhar", async () => {
        jest.spyOn(GetAuthorUseCase.prototype, "handler").mockRejectedValueOnce(new Error("erro"));

        const req = {} as express.Request;
        const res = makeRes();

        await getAuthors(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erro ao buscar autores" });
    });
});
