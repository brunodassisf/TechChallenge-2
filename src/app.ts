import express from 'express';
import { env } from '@/env';
import { postRouter } from '@/routes/postRouter';
import { authorRouter } from '@/routes/authorRouter';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@/lib/swagger";

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/post', postRouter)
app.use('/author', authorRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  return res.status(500).json({ message: 'Erro interno do servidor' });
});

app.listen(env.PORT, () => {
  console.log(`Server listening at http://localhost:${env.PORT}`);
});
