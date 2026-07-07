import express from 'express';
import { Router } from 'express';
import AuthorController from '@/controllers/authorController';

export const authorRouter: Router = express.Router();

authorRouter.post('/', new AuthorController().create)
