import { Module } from "@nestjs/common";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { ScheduleRepository } from "./repositories/schedule.repository";
import { SchedulePlanner } from "./schedule.planner";
import { ScheduleWorker } from "./schedule.worker";
import { CacheModule } from "@/infra/cache/cache.module";
import { QueueModule } from "@/infra/queue/queue.module";
import { DispatchModule } from "@/infra/dispatch/dispatch.module";

@Module({
  imports: [CacheModule, QueueModule, DispatchModule],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    SchedulePlanner,
    ScheduleWorker,
  ],
})
export class ScheduleModule {}
