import { Module } from "@nestjs/common";
import { ControllerController } from "./controller.controller";
import { ControllerService } from "./controller.service";
import { ControllerRepository } from "./repositories/controller.repository";
import { DispatchModule } from "@/infra/dispatch/dispatch.module";

@Module({
  imports: [DispatchModule],
  controllers: [ControllerController],
  providers: [ControllerService, ControllerRepository],
})
export class ControllerModule {}
