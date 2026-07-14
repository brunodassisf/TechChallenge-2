import express from 'express';
import { Router } from 'express';
import { create, getAuthors } from '@/controllers/authorController';

export const authorRouter: Router = express.Router();

authorRouter.post('/', create);
authorRouter.get('/', getAuthors);

/**
 * @openapi
 * /author:
 *   post:
 *     tags: [Authors]
 *     summary: Cria um novo autor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string, minLength: 3 }
 *               email: { type: string, minLength: 3 }
 *     responses:
 *       201:
 *         description: Post criado com sucesso!
 *          
 *       500:
 *         description: Erro ao cadastrar post
 *   get:
 *     tags: [Authors]
 *     summary: Lista todos os autores
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Author' }
 */
