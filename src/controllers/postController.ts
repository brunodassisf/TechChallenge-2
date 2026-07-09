import express from "express";
import z from "zod";
import { PostNotFoundError } from "@/errors/post-not-found.error";
import { PostRepository } from "@/repositories/post.repository";
import { CreatePostUseCase, GetPostsUseCase, GetPostByIdUseCase, UpdatePostUseCase, DeletePostUseCase, SearchPostUseCase } from "@/use-cases/create-post";


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
        const post = await createPostUseCase.handler(title, content, authorId);
        return res.status(201).json({
            message: "Post cadastrado com sucesso!",
            data: post
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao cadastrar post" });
    }
}

export async function getPosts(req: express.Request, res: express.Response) {
    try {
        const postRepository = new PostRepository();
        const getPostsUseCase = new GetPostsUseCase(postRepository);
        const posts = await getPostsUseCase.handler();
        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar posts" });
    }
}

export async function getPostById(req: express.Request, res: express.Response) {
    try {
        const postRepository = new PostRepository();
        const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
        const post = await getPostByIdUseCase.handler(req.params.id as string);
        return res.status(200).json(post);
    } catch (error) {
        console.error(error);
        if (error instanceof PostNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro ao buscar post" });
    }
}

export async function updatePost(req: express.Request, res: express.Response) {
    try {
        const postRepository = new PostRepository();
        const updatePostUseCase = new UpdatePostUseCase(postRepository);
        const post = await updatePostUseCase.handler(req.params.id as string, req.body);
        return res.status(200).json({
            message: 'Post atualizado com sucesso!',
            data: post
        });
    } catch (error) {
        console.error(error);
        if (error instanceof PostNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro ao atualizar post" });
    }
}

export async function deletePost(req: express.Request, res: express.Response) {
    try {
        const postRepository = new PostRepository();
        const deletePostUseCase = new DeletePostUseCase(postRepository);
        await deletePostUseCase.handler(req.params.id as string);
        return res.status(200).json({
            message: 'Post deletado com sucesso!'
        });

    } catch (error) {
        console.error(error);
        if (error instanceof PostNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro ao deletar post" });
    }
}

export async function searchPost(req: express.Request, res: express.Response) {
    try {

        const querySchema = z.object({
            title: z.string().optional(),
            content: z.string().optional(),
            author: z.string().optional()
        });
        const { title, content, author } = querySchema.parse(req.query);

        const postRepository = new PostRepository();
        const searchPostUseCase = new SearchPostUseCase(postRepository);
        const posts = await searchPostUseCase.handler(title, content, author);
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar posts" });
    }
}



