
export interface ScheduleDispatchJob {
  scheduleId: string;
  roomId: string;
  action: "TURN_ON" | "TURN_OFF";
  /** Instante em que o agendamento deveria disparar, em ISO. */
  scheduledFor: string;
}

export function buildDispatchJobId(
  scheduleId: string,
  scheduledFor: string,
): string {
  return `${scheduleId}-${new Date(scheduledFor).getTime()}`;
}
