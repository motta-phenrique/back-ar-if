import { z } from "zod";
import { hasValidRange, scheduleBaseSchema } from "./create-schedule";

export const updateScheduleBodySchema = scheduleBaseSchema
  .partial()
  .refine(hasValidRange, {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  });

export type UpdateScheduleDto = z.infer<typeof updateScheduleBodySchema>;
