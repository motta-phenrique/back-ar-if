import { Injectable } from "@nestjs/common";
import { AcState, ControllerDispatcher } from "./controller-dispatcher";
import { ELGIN_PREAMBLE, encodeElgin, toHex } from "./elgin-ir";
import { MqttService } from "@/infra/mqtt/mqtt.service";

/**
 * Contrato com o firmware:
 *   tópico  controllers/{controllerId}/command
 *   payload {"frames":["23cb2602…","23cb2601…"]}
 *
 * O firmware dispara cada quadro em ordem (bytes LSB primeiro) e não precisa
 * saber marca nem estado. O id e não o slug: o slug só é único dentro da sala.
 *
 * `retain` faz o aparelho receber o último estado ao (re)conectar. QoS 1
 * garante entrega ao broker, não ao aparelho.
 */
@Injectable()
export class MqttControllerDispatcher extends ControllerDispatcher {
  constructor(private readonly mqtt: MqttService) {
    super();
  }

  async send(controllerId: string, state: AcState): Promise<void> {
    await this.mqtt.publish(
      `controllers/${controllerId}/command`,
      JSON.stringify({
        frames: [toHex(ELGIN_PREAMBLE), toHex(encodeElgin(state))],
      }),
      { qos: 1, retain: true },
    );
  }
}
