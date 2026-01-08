import { z } from 'zod';

/**
 * Environment variable schema for validation
 */
export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    NEXT_PUBLIC_API_URL: z.string().url(),

    INTERNAL_API_URL: z.string().url().optional(),
});
export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    INTERNAL_API_URL: process.env.INTERNAL_API_URL,
});
