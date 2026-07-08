
import { AuthorRepository } from "@/repositories/author.repository";
import { CreateAuthorUseCase } from "@/use-cases/create-author";
import express from "express";
import z from "zod";


export async function create(req: express.Request, res: express.Response) {

    const registerBodySchema = z.object({
        name: z.string().min(3),
        email: z.email()
    })

    const { name, email } = registerBodySchema.parse(req.body);

    try {
        const authorRepository = new AuthorRepository();
        const createAuthorUseCase = new CreateAuthorUseCase(authorRepository);
        await createAuthorUseCase.handler({ name, email });

        return res.status(201).json({
            message: "Autor cadastrado com sucesso!"
        });

    } catch (error) {
        console.error(error);

        throw new Error("Erro ao cadastrar autor");
    }
}






