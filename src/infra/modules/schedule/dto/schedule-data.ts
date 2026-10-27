import type { CreateScheduleDto } from "./create-schedule";

/**
 * O que o repositório grava, que é o DTO do HTTP mais os campos derivados pelo
 * service: `slug` vem do nome, `roomId` da rota e `createdById` do token.
 * Manter os dois tipos separados impede que o cliente escreva esses campos.
 */
export type CreateScheduleData = CreateScheduleDto & {
  slug: string;
  roomId: string;
  createdById: string;
};

export type UpdateScheduleData = Partial<CreateScheduleDto & { slug: string }>;

export type ScheduleRunStatus = "SUCCESS" | "FAILED" | "SKIPPED";

export interface CreateScheduleRunData {
  scheduleId: string;
  scheduledFor: Date;
  status: ScheduleRunStatus;
  error?: string;
}
