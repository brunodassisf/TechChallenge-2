import express from 'express';
import { env } from './env';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.PORT, () => {
  console.log(`Server listening at http://localhost:${env.PORT}`);
});
