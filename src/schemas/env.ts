import { z } from 'zod';

/**
 * Environment variable schema for validation
 */
export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});
export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
});
