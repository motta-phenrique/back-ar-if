import { Injectable, Logger } from "@nestjs/common";
import {
  ControllerCommand,
  ControllerDispatcher,
} from "./controller-dispatcher";

/**
 * Implementação temporária: só registra o que teria sido enviado. Serve para
 * exercitar a fila, o retry e o histórico enquanto o transporte real não existe.
 */
@Injectable()
export class LoggingControllerDispatcher extends ControllerDispatcher {
  private readonly logger = new Logger(LoggingControllerDispatcher.name);

  async send(command: ControllerCommand): Promise<void> {
    this.logger.log(
      `${command.action} -> controlador ${command.controllerSlug} (sala ${command.roomId})`,
    );
  }
}
