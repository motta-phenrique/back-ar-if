import { z } from "zod";

export const controllerOutputSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
  roomId: z.uuid(),
  power: z.boolean(),
  mode: z.enum(["HEAT", "DRY", "COOL", "FAN"]),
  temp: z.number().int(),
  fan: z.enum(["AUTO", "LOW", "MEDIUM", "HIGH"]),
  swingVertical: z.boolean(),
  swingHorizontal: z.boolean(),
  turbo: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ControllerOutput = z.infer<typeof controllerOutputSchema>;
