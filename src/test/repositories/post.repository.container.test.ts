import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type { PostRepository as PostRepositoryClass } from "@/repositories/post.repository";
import type { AuthorRepository as AuthorRepositoryClass } from "@/repositories/author.repository";
import type { Database as DatabaseClass } from "@/lib/pg/db";

// Testes de integração: sobem um Postgres real via Testcontainers (exige Docker).
// As dependências (@/env, @/lib/pg/db, repositories) só podem ser importadas
// DEPOIS de configurar as variáveis de ambiente do container, então usamos
// `import()` dinâmico dentro do beforeAll em vez de `import` no topo do arquivo.
describe("PostRepository (container)", () => {
    let container: StartedPostgreSqlContainer;
    let database: DatabaseClass;
    let postRepository: PostRepositoryClass;
    let authorRepository: AuthorRepositoryClass;
    let authorId: string;

    beforeAll(async () => {
        container = await new PostgreSqlContainer("postgres:16-alpine").start();

        process.env.DB_HOST = container.getHost();
        process.env.DB_PORT = String(container.getPort());
        process.env.DB_USER = container.getUsername();
        process.env.DB_PASSWORD = container.getPassword();
        process.env.DB_NAME = container.getDatabase();

        ({ database } = await import("@/lib/pg/db"));
        await database.ready;

        const { PostRepository } = await import("@/repositories/post.repository");
        const { AuthorRepository } = await import("@/repositories/author.repository");
        postRepository = new PostRepository();
        authorRepository = new AuthorRepository();

        const author = await authorRepository.create("Autor Teste", "autor@teste.com");
        authorId = author!.id as string;
    }, 60_000);

    afterAll(async () => {
        await database.close();
        await container.stop();
    });

    it("cria e busca um post pelo id, com o autor embutido", async () => {
        const created = await postRepository.create("Título", "Conteúdo", authorId);

        const found = await postRepository.findById(created.id as string);

        expect(found.title).toBe("Título");
        expect(found.content).toBe("Conteúdo");
        expect(found.author).toEqual({
            id: authorId,
            name: "Autor Teste",
            email: "autor@teste.com",
        });
    });

    it("lista todos os posts", async () => {
        await postRepository.create("Post A", "Conteúdo A", authorId);
        await postRepository.create("Post B", "Conteúdo B", authorId);

        const posts = await postRepository.findAll();

        expect(posts.length).toBeGreaterThanOrEqual(2);
    });

    it("atualiza um post existente", async () => {
        const created = await postRepository.create("Antigo", "Conteúdo antigo", authorId);

        const updated = await postRepository.updateById(created.id as string, {
            title: "Novo título",
            content: "Novo conteúdo",
            authorId,
        } as never);

        expect(updated.title).toBe("Novo título");
        expect(updated.content).toBe("Novo conteúdo");
    });

    it("lança PostNotFoundError ao atualizar um post inexistente", async () => {
        const { PostNotFoundError } = await import("@/errors/post-not-found.error");

        await expect(
            postRepository.updateById("00000000-0000-0000-0000-000000000000", {
                title: "x",
                content: "y",
                authorId,
            } as never)
        ).rejects.toBeInstanceOf(PostNotFoundError);
    });

    it("deleta um post existente", async () => {
        const created = await postRepository.create("Para deletar", "Conteúdo", authorId);

        await postRepository.deleteById(created.id as string);

        const { PostNotFoundError } = await import("@/errors/post-not-found.error");
        await expect(postRepository.findById(created.id as string)).rejects.toBeInstanceOf(PostNotFoundError);
    });
});
