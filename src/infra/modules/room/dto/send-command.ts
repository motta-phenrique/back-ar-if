import { z } from "zod";

export const sendCommandBodySchema = z.object({
  action: z.enum(["TURN_ON", "TURN_OFF"]),
});

export type SendCommandDto = z.infer<typeof sendCommandBodySchema>;
