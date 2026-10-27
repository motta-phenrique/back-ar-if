import { z } from "zod";

export const createCampusBodySchema = z.object({
    name: z.string(),
});


export type CreateCampusDto = z.infer<typeof createCampusBodySchema>;