import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { ScheduleRepository } from "./repositories/schedule.repository";
import { SCHEDULE_DISPATCH_QUEUE } from "@/infra/queue/queue-names";
import {
  buildDispatchJobId,
  ScheduleDispatchJob,
} from "@/infra/queue/schedule-dispatch-job";
import { getZonedParts, zonedTimeToUtc, ZonedParts } from "@/infra/utils/timezone";

/**
 * Quantos minutos para trás o planner olha além do minuto atual. Serve para
 * recuperar disparos perdidos durante um deploy ou uma pausa do processo; a
 * idempotência é que impede o reenvio do que já rodou.
 */
const LOOKBACK_MINUTES = 3;

@Injectable()
export class SchedulePlanner {
  private readonly logger = new Logger(SchedulePlanner.name);

  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    @InjectQueue(SCHEDULE_DISPATCH_QUEUE) private readonly queue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async tick() {
    await this.plan(new Date());
  }

  /**
   * Recebe o instante por parâmetro (em vez de usar `new Date()` aqui dentro)
   * para que a regra possa ser testada em qualquer horário.
   */
  async plan(now: Date): Promise<number> {
    const timezones = await this.scheduleRepository.findActiveTimezones();

    let enqueued = 0;

    for (const timezone of timezones) {
      const candidates = this.buildCandidates(now, timezone);
      const schedules = await this.scheduleRepository.findDueByTimezone(
        timezone,
        candidates.map((candidate) => candidate.time),
      );

      for (const schedule of schedules) {
        const candidate = candidates.find(
          (item) =>
            item.time === schedule.time &&
            schedule.daysOfWeek.includes(item.weekday),
        );

        if (!candidate) {
          continue;
        }

        const scheduledFor = zonedTimeToUtc(
          candidate.date,
          candidate.time,
          timezone,
        );

        if (schedule.startsAt && scheduledFor < schedule.startsAt) {
          continue;
        }

        if (schedule.endsAt && scheduledFor > schedule.endsAt) {
          continue;
        }

        const data: ScheduleDispatchJob = {
          scheduleId: schedule.id,
          roomId: schedule.roomId,
          action: schedule.action,
          scheduledFor: scheduledFor.toISOString(),
        };

        await this.queue.add("dispatch", data, {
          jobId: buildDispatchJobId(schedule.id, data.scheduledFor),
        });

        enqueued += 1;
      }
    }

    if (enqueued > 0) {
      this.logger.log(`${enqueued} comando(s) enfileirado(s)`);
    }

    return enqueued;
  }

  /**
   * O minuto atual e os anteriores da janela, já traduzidos para o relógio
   * local do fuso. Cada minuto é resolvido separadamente porque a janela pode
   * atravessar a meia-noite e cair em outro dia da semana.
   */
  private buildCandidates(now: Date, timeZone: string): ZonedParts[] {
    const candidates: ZonedParts[] = [];

    for (let offset = 0; offset <= LOOKBACK_MINUTES; offset++) {
      const instant = new Date(now.getTime() - offset * 60_000);
      candidates.push(getZonedParts(instant, timeZone));
    }

    return candidates;
  }
}