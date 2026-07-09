import express from 'express';
import { Router } from 'express';
import { create, getPosts, getPostById, updatePost, deletePost, searchPost } from '@/controllers/postController';

export const postRouter: Router = express.Router();

postRouter.post('/', create)
postRouter.get('/', getPosts)
postRouter.get('/search', searchPost)
postRouter.get('/:id', getPostById)
postRouter.put('/:id', updatePost)
postRouter.delete('/:id', deletePost)
