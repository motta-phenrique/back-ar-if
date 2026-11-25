import { z } from "zod";

export const updateStateBodySchema = z
  .object({
    power: z.boolean(),
    mode: z.enum(["HEAT", "DRY", "COOL", "FAN"]),
    temp: z.number().int().min(16).max(31),
    fan: z.enum(["AUTO", "LOW", "MEDIUM", "HIGH"]),
    swingVertical: z.boolean(),
    swingHorizontal: z.boolean(),
    turbo: z.boolean(),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0, "nothing to change");

export type UpdateStateDto = z.infer<typeof updateStateBodySchema>;
