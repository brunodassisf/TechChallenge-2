import express from 'express';
import { Router } from 'express';
import PostController from '@/controllers/postController';

export const postRouter: Router = express.Router();

postRouter.post('/', new PostController().create)
