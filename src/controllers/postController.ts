import { PostRepository } from "@/repositories/post.repository";
import { CreatePostUseCase } from "@/use-cases/create-post";
import express from "express";
import z from "zod";


export async function create(req: express.Request, res: express.Response) {

    const registerBodySchema = z.object({
        title: z.string().min(3),
        content: z.string().min(3),
        authorId: z.uuid(),
    })

    const { title, content, authorId } = registerBodySchema.parse(req.body);

    try {

        const postRepository = new PostRepository();
        const createPostUseCase = new CreatePostUseCase(postRepository);
        await createPostUseCase.handler(title, content, authorId);

        return res.status(201).json({
            message: "Post cadastrado com sucesso!"
        });

    } catch (error) {
        console.error(error);

        throw new Error("Erro ao cadastrar post");
    }
}






