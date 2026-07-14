import express from 'express';
import { Router } from 'express';
import { create, getPosts, getPostById, updatePost, deletePost, searchPost } from '@/controllers/postController';

export const postRouter: Router = express.Router();

postRouter.post('/', create);
postRouter.get('/', getPosts);
postRouter.get('/search', searchPost);
postRouter.get('/:id', getPostById);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);

/**
 * @openapi
 * /post:
 *   post:
 *     tags: [Posts]
 *     summary: Cria um novo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, authorId]
 *             properties:
 *               title: { type: string, minLength: 3 }
 *               content: { type: string, minLength: 3 }
 *               authorId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *       500:
 *         description: Erro ao cadastrar post
 *   get:
 *     tags: [Posts]
 *     summary: Lista todos os posts
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Post' }
 *
 * /post/search:
 *   get:
 *     tags: [Posts]
 *     summary: Busca posts de acordo com os parâmetros da query
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: content
 *         schema: { type: string }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de posts de acordo com a busca
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Post' }
 *
 * /post/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Buscar um post de acordo com o ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Post' }
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro ao buscar post
 *   put:
 *     tags: [Posts]
 *     summary: Atualiza um post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, authorId]
 *             properties:
 *               title: { type: string, minLength: 3 }
 *               content: { type: string, minLength: 3 }
 *               authorId: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Post atualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Post' }
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro ao atualizar post
 *   delete:
 *     tags: [Posts]
 *     summary: Deleta um post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Post deletado com sucesso
 *       404:
 *         description: Post não encontrado
 *       500:
 *         description: Erro ao deletar post
 */
