import { z } from "zod";

export const blockOutputSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
  campusId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlockOutput = z.infer<typeof blockOutputSchema>;

export function toBlockOutput(block: BlockOutput): BlockOutput {
  return blockOutputSchema.parse(block);
}
