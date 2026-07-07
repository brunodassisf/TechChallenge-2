
import express from "express";

class PostController {
    create = async (req: express.Request, res: express.Response) => {
        const { title, content, authorId } = req.body;

        if (!title || !content || !authorId) {
            throw new Error("Campos ausentes")
        }
        res.status(201).json({
            message: "Post criado com sucesso!"
        })
    }
}


export default PostController