
import express from "express";

class AuthorController {
    create = async (req: express.Request, res: express.Response) => {
        const { name, email } = req.body;

        if (!name || !email) {
            throw new Error("Campos ausentes")
        }
        res.status(201).json({
            message: "Autor cadastrado com sucesso!"
        })
    }

}


export default AuthorController