import { z } from "zod";

export const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
});


export type CreateAccountDto = z.infer<typeof createAccountBodySchema>;
