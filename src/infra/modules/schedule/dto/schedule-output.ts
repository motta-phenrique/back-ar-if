import { z } from "zod";

export const scheduleOutputSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
  roomId: z.uuid(),
  action: z.enum(["TURN_ON", "TURN_OFF"]),
  daysOfWeek: z.array(z.number().int()),
  time: z.string(),
  timezone: z.string(),
  startsAt: z.date().nullable(),
  endsAt: z.date().nullable(),
  enabled: z.boolean(),
  lastRunAt: z.date().nullable(),
  createdById: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ScheduleOutput = z.infer<typeof scheduleOutputSchema>;

export function toScheduleOutput(schedule: ScheduleOutput): ScheduleOutput {
  return scheduleOutputSchema.parse(schedule);
}
