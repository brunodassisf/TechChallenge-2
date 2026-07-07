import express from 'express';
import { env } from '@/env';
import { postRouter } from '@/routes/postRouter';
import { authorRouter } from '@/routes/authorRouter';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/post', postRouter)
app.use('/author', authorRouter)

app.listen(env.PORT, () => {
  console.log(`Server listening at http://localhost:${env.PORT}`);
});
