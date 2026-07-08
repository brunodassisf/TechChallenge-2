import express from 'express';
import { Router } from 'express';
import { create } from '@/controllers/postController';

export const postRouter: Router = express.Router();

postRouter.post('/', create)
