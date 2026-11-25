import { ElginState } from "./elgin-ir";

export type AcState = ElginState;

/**
 * Contrato de envio do estado até o aparelho. O transporte (MQTT hoje) e a
 * codificação IR ficam na implementação; quem chama só fala em estado.
 */
export abstract class ControllerDispatcher {
  abstract send(controllerId: string, state: AcState): Promise<void>;
}
