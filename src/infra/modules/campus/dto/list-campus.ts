import { z } from "zod";
import { campusOutputSchema } from "./campus-output";

export const listCampusQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListCampusQueryDto = z.infer<typeof listCampusQuerySchema>;

export const listCampusOutputSchema = z.object({
  data: z.array(campusOutputSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type ListCampusOutput = z.infer<typeof listCampusOutputSchema>;
