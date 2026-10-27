import { z } from "zod";

export const userOutputSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["ADMIN", "USER"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserOutput = z.infer<typeof userOutputSchema>;
