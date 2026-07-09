import express from 'express';
import { Router } from 'express';
import { create, getAuthors } from '@/controllers/authorController';

export const authorRouter: Router = express.Router();

authorRouter.post('/', create)
authorRouter.get('/', getAuthors)
