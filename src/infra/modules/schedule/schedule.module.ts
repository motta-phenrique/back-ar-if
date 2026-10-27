import { Module } from "@nestjs/common";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { ScheduleRepository } from "./repositories/schedule.repository";
import { SchedulePlanner } from "./schedule.planner";
import { ScheduleWorker } from "./schedule.worker";
import { ControllerDispatcher } from "./dispatch/controller-dispatcher";
import { LoggingControllerDispatcher } from "./dispatch/logging-controller-dispatcher";
import { CacheModule } from "@/infra/cache/cache.module";
import { QueueModule } from "@/infra/queue/queue.module";

@Module({
  imports: [CacheModule, QueueModule],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    SchedulePlanner,
    ScheduleWorker,
    {
      provide: ControllerDispatcher,
      useClass: LoggingControllerDispatcher,
    },
  ],
})
export class ScheduleModule {}
