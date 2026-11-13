import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .regex(
      /^mongodb(\+srv)?:\/\//,
      'MONGODB_URI must start with mongodb:// or mongodb+srv://',
    ),
  PORT: z.coerce.number().int().positive().default(3000),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD: z.string().min(10).optional(),
  JWT_SECRET: z.string().min(32),
});

export const env = envSchema.parse(process.env);
