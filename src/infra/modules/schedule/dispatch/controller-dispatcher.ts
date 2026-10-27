export interface ControllerCommand {
  controllerId: string;
  controllerSlug: string;
  roomId: string;
  action: "TURN_ON" | "TURN_OFF";
}

/**
 * Contrato de envio do comando até o aparelho. É abstrato de propósito: o
 * transporte real (MQTT, HTTP num gateway, API de fabricante) entra como uma
 * implementação nova sem que o worker precise mudar.
 */
export abstract class ControllerDispatcher {
  abstract send(command: ControllerCommand): Promise<void>;
}
