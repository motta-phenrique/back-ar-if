import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { AcState, ControllerDispatcher } from "./controller-dispatcher";

type ControllerWithState = AcState & { id: string };

/**
 * Único caminho para mudar um ar: junta a mudança com o último estado salvo,
 * envia e só então grava. Usado pelo front, pelo acionamento da sala e pelo
 * worker de agendamentos.
 */
@Injectable()
export class ControllerStateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dispatcher: ControllerDispatcher,
  ) {}

  async apply(
    controller: ControllerWithState,
    patch: Partial<AcState>,
  ): Promise<AcState> {
    const state: AcState = {
      power: patch.power ?? controller.power,
      mode: patch.mode ?? controller.mode,
      temp: patch.temp ?? controller.temp,
      fan: patch.fan ?? controller.fan,
      swingVertical: patch.swingVertical ?? controller.swingVertical,
      swingHorizontal: patch.swingHorizontal ?? controller.swingHorizontal,
      turbo: patch.turbo ?? controller.turbo ?? false,
    };

    // Grava só depois de enviar: se o broker estiver fora, o banco continua
    // refletindo o que o aparelho de fato recebeu por último.
    await this.dispatcher.send(controller.id, state);

    await this.prisma.controller.update({
      where: { id: controller.id },
      data: state,
    });

    return state;
  }
}
