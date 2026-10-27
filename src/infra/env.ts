import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(8001),
  JWT_SECRET: z.string(),
  ENVIRONMENT: z.enum(["DEVELOPMENT", "PRODUCTION"]).default("DEVELOPMENT"),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_DB: z.coerce.number().default(0),
});

export type Env = z.infer<typeof envSchema>;
