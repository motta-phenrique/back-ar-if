import { Module } from "@nestjs/common";
import { MqttModule } from "@/infra/mqtt/mqtt.module";
import { ControllerDispatcher } from "./controller-dispatcher";
import { MqttControllerDispatcher } from "./mqtt-controller-dispatcher";
import { ControllerStateService } from "./controller-state.service";

/**
 * Ponto único de envio de comandos: o worker de agendamentos, o acionamento da
 * sala e o controle pelo front passam todos pelo `ControllerStateService`.
 */
@Module({
  imports: [MqttModule],
  providers: [
    { provide: ControllerDispatcher, useClass: MqttControllerDispatcher },
    ControllerStateService,
  ],
  exports: [ControllerStateService],
})
export class DispatchModule {}
