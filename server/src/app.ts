import express from 'express';
import { z } from 'zod';
import { validate } from './middlewares/validate.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/boom', () => {
  throw new Error('boom');
});

const testSchema = z.object({ email: z.email(), name: z.string().min(2) });

app.post('/api/test-validate', validate(testSchema), (req, res) =>
  res.json(req.body),
);
app.use(errorHandler);
