import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { authRouter } from './routes/auth.routes.js';
import { medicationsRouter } from './routes/medications.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { analyticsRouter } from './routes/analytics.routes.js';
import { consultationsRouter } from './routes/consultations.routes.js';
import { pushRouter } from './routes/push.routes.js';

const app = express();
app.use(cors({ origin: process.env.APP_URL ?? 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' })); // increased for base64 OCR image payloads

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/consultations', consultationsRouter);
app.use('/api/push', pushRouter);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) { res.status(400).json({ error: 'Invalid request.', details: error.flatten() }); return; }
  if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') { res.status(409).json({ error: 'A record with that value already exists.' }); return; }
  console.error(error);
  res.status(500).json({ error: 'Unexpected server error.' });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`GenericMed API listening on ${port}`));
