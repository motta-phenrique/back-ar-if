import { z } from "zod";

export const sessionAccountBodySchema = z.object({
  email: z.email(),
  password: z.string(), 
});

export type SessionAccountDto = z.infer<typeof sessionAccountBodySchema>;

