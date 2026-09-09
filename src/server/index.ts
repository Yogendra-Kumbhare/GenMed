import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { authRouter } from './routes/auth.routes';
import { medicationsRouter } from './routes/medications.routes';

const app = express();
app.use(cors({ origin: process.env.APP_URL ?? 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/medications', medicationsRouter);
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) { res.status(400).json({ error: 'Invalid request.', details: error.flatten() }); return; }
  if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') { res.status(409).json({ error: 'A record with that value already exists.' }); return; }
  console.error(error);
  res.status(500).json({ error: 'Unexpected server error.' });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`GenericMed API listening on ${port}`));
