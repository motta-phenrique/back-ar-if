import { z } from "zod";

export const createControllerBodySchema = z.object({
  name: z.string().min(1),
});

export type CreateControllerDto = z.infer<typeof createControllerBodySchema>;
