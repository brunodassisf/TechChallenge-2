
import express from "express";
import z from "zod";
import { AuthorRepository } from "@/repositories/author.repository";
import { CreateAuthorUseCase, GetAuthorUseCase } from "@/use-cases/use-author";


export async function create(req: express.Request, res: express.Response) {

    const registerBodySchema = z.object({
        name: z.string().min(3),
        email: z.email()
    })

    const { name, email } = registerBodySchema.parse(req.body);

    try {
        const authorRepository = new AuthorRepository();
        const createAuthorUseCase = new CreateAuthorUseCase(authorRepository);
        const author = await createAuthorUseCase.handler(name, email);

        return res.status(201).json({
            message: "Autor cadastrado com sucesso!",
            data: author
        });

    } catch (error) {
        return res.status(500).json({ message: "Erro ao cadastrar autor" });
    }
}

export async function getAuthors(req: express.Request, res: express.Response) {
    try {
        const authorRepository = new AuthorRepository();
        const getAuthorUseCase = new GetAuthorUseCase(authorRepository);
        const authors = await getAuthorUseCase.handler();

        return res.status(201).json(authors);

    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar autores" });
    }
}






