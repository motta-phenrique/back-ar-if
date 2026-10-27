import { z } from "zod";

export const createBlockBodySchema = z.object({
    name: z.string().min(1),
});


export type CreateBlockDto = z.infer<typeof createBlockBodySchema>;
