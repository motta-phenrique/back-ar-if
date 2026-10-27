import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

export const scheduleBaseSchema = z.object({
  name: z.string().min(1),
  action: z.enum(["TURN_ON", "TURN_OFF"]),
  daysOfWeek: z
    .array(z.number().int().min(0).max(6))
    .min(1)
    .transform((days) => [...new Set(days)].sort((a, b) => a - b)),
  time: z.string().regex(timeRegex, 'time must be in "HH:mm" format'),
  timezone: z
    .string()
    .refine(isValidTimezone, "timezone must be a valid IANA name")
    .default("America/Sao_Paulo"),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  enabled: z.boolean().default(true),
});

export function hasValidRange(data: {
  startsAt?: Date;
  endsAt?: Date;
}): boolean {
  if (!data.startsAt || !data.endsAt) {
    return true;
  }

  return data.startsAt <= data.endsAt;
}

export const createScheduleBodySchema = scheduleBaseSchema.refine(
  hasValidRange,
  {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  },
);

export type CreateScheduleDto = z.infer<typeof createScheduleBodySchema>;
