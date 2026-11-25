import { Logger } from "@nestjs/common";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ScheduleRepository } from "./repositories/schedule.repository";
import { ControllerStateService } from "@/infra/dispatch/controller-state.service";
import { SCHEDULE_DISPATCH_QUEUE } from "@/infra/queue/queue-names";
import { ScheduleDispatchJob } from "@/infra/queue/schedule-dispatch-job";

@Processor(SCHEDULE_DISPATCH_QUEUE, { concurrency: 20 })
export class ScheduleWorker extends WorkerHost {
  private readonly logger = new Logger(ScheduleWorker.name);

  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly controllerState: ControllerStateService,
  ) {
    super();
  }

  async process(job: Job<ScheduleDispatchJob>): Promise<void> {
    const { scheduleId, action } = job.data;
    const scheduledFor = new Date(job.data.scheduledFor);

    const alreadyRan = await this.scheduleRepository.findRun(
      scheduleId,
      scheduledFor,
    );

    if (alreadyRan) {
      return;
    }

    const schedule =
      await this.scheduleRepository.findByIdWithControllers(scheduleId);

    // Apagado entre o enfileiramento e agora: não há o que fazer, e nem onde
    // registrar, já que a `ScheduleRun` aponta para ele.
    if (!schedule) {
      return;
    }

    // Desativado depois de enfileirado — inclusive entre uma tentativa e a
    // seguinte, já que os retries se espalham por minutos.
    if (!schedule.enabled) {
      await this.scheduleRepository.createRun({
        scheduleId,
        scheduledFor,
        status: "SKIPPED",
        error: "schedule disabled after being queued",
      });
      return;
    }

    const controllers = schedule.room.controllers;

    if (controllers.length === 0) {
      await this.scheduleRepository.createRun({
        scheduleId,
        scheduledFor,
        status: "SKIPPED",
        error: "room has no controllers",
      });
      return;
    }

    // Um controlador que falha derruba o job inteiro, e a tentativa seguinte
    // reenvia para todos. É aceitável porque o IR manda o estado inteiro —
    // reenviar o mesmo estado não muda nada no aparelho. Liga no último estado
    // usado (temperatura, modo etc.), só troca o power.
    for (const controller of controllers) {
      await this.controllerState.apply(controller, {
        power: action === "TURN_ON",
      });
    }

    await this.scheduleRepository.createRun({
      scheduleId,
      scheduledFor,
      status: "SUCCESS",
    });
  }

  /**
   * O `FAILED` só é gravado quando as tentativas acabam. Registrar a cada
   * falha esbarraria no índice único de `(scheduleId, scheduledFor)` na segunda
   * tentativa, e um retry bem-sucedido deixaria um registro de erro mentindo
   * no histórico.
   */
  @OnWorkerEvent("failed")
  async onFailed(job: Job<ScheduleDispatchJob>, error: Error) {
    const attempts = job.opts.attempts ?? 1;

    if (job.attemptsMade < attempts) {
      this.logger.warn(
        `tentativa ${job.attemptsMade}/${attempts} falhou para o agendamento ${job.data.scheduleId}: ${error.message}`,
      );
      return;
    }

    this.logger.error(
      `agendamento ${job.data.scheduleId} falhou definitivamente: ${error.message}`,
    );

    await this.scheduleRepository
      .createRun({
        scheduleId: job.data.scheduleId,
        scheduledFor: new Date(job.data.scheduledFor),
        status: "FAILED",
        error: error.message,
      })
      .catch(() => undefined);
  }
}
