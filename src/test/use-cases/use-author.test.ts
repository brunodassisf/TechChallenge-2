import { Author } from "@/entities/author.entity";
import { AuthorRepository } from "@/repositories/author.repository";
import { CreateAuthorUseCase, GetAuthorUseCase } from "@/use-cases/use-author";

describe("CreateAuthorUseCase", () => {
    let authorRepository: jest.Mocked<AuthorRepository>;
    let sut: CreateAuthorUseCase;

    beforeEach(() => {
        authorRepository = {
            create: jest.fn(),
        } as unknown as jest.Mocked<AuthorRepository>;

        sut = new CreateAuthorUseCase(authorRepository);
    });

    it("deve criar um autor delegando para o repositório", async () => {
        const fakeAuthor = new Author("Gabriel", "gabriel@email.com");
        authorRepository.create.mockResolvedValueOnce(fakeAuthor);

        const result = await sut.handler("Gabriel", "gabriel@email.com");

        expect(authorRepository.create).toHaveBeenCalledWith(
            "Gabriel",
            "gabriel@email.com"
        );
        expect(authorRepository.create).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakeAuthor);
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        authorRepository.create.mockRejectedValueOnce(new Error("Erro ao cadastrar author"));

        await expect(
            sut.handler("Gabriel", "gabriel@email.com")
        ).rejects.toThrow("Erro ao cadastrar author");
    });
});

describe("GetAuthorUseCase", () => {
    let authorRepository: jest.Mocked<AuthorRepository>;
    let sut: GetAuthorUseCase;

    beforeEach(() => {
        authorRepository = {
            getAuthors: jest.fn(),
        } as unknown as jest.Mocked<AuthorRepository>;

        sut = new GetAuthorUseCase(authorRepository);
    });

    it("deve criar um autor delegando para o repositório", async () => {
        const fakeAuthor = [new Author("Gabriel", "gabriel@email.com")];
        authorRepository.getAuthors.mockResolvedValue(fakeAuthor);

        const result = await sut.handler();

        expect(authorRepository.getAuthors).toHaveBeenCalledTimes(1);
        expect(result).toEqual(fakeAuthor);
    });

    it("deve propagar o erro se o repositório falhar", async () => {
        authorRepository.getAuthors.mockRejectedValueOnce(new Error("Erro ao buscar authors"));

        await expect(
            sut.handler()
        ).rejects.toThrow("Erro ao buscar authors");
    });
});
