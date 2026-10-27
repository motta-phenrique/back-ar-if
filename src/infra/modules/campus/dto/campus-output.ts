import { z } from "zod";

export const campusOutputSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CampusOutput = z.infer<typeof campusOutputSchema>;

export function toCampusOutput(campus: CampusOutput): CampusOutput {
  return campusOutputSchema.parse(campus);
}
