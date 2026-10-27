import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";
import type {
  CreateScheduleData,
  CreateScheduleRunData,
  UpdateScheduleData,
} from "../dto/schedule-data";

@Injectable()
export class ScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateScheduleData) {
    return await this.prisma.schedule.create({
      data,
    });
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    return await this.prisma.schedule.findFirst({
      where: {
        id,
        room: {
          block: {
            campus: {
              ownerId,
            },
          },
        },
      },
    });
  }

  async findBySlugAndRoom(slug: string, roomId: string) {
    return await this.prisma.schedule.findUnique({
      where: {
        roomId_slug: {
          roomId,
          slug,
        },
      },
    });
  }

  async findManyByRoom(roomId: string) {
    return await this.prisma.schedule.findMany({
      where: {
        roomId,
      },
      orderBy: [{ time: "asc" }, { createdAt: "desc" }],
    });
  }

  async update(id: string, data: UpdateScheduleData) {
    return await this.prisma.schedule.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    await this.prisma.schedule.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Fusos distintos entre os agendamentos ativos. O planner precisa deles para
   * saber quais relógios locais consultar a cada minuto.
   */
  async findActiveTimezones() {
    const rows = await this.prisma.schedule.findMany({
      where: {
        enabled: true,
      },
      select: {
        timezone: true,
      },
      distinct: ["timezone"],
    });

    return rows.map((row) => row.timezone);
  }

  /**
   * Agendamentos ativos de um fuso cujo horário bate com algum dos minutos da
   * janela. Usa o índice `(enabled, time)`.
   */
  async findDueByTimezone(timezone: string, times: string[]) {
    return await this.prisma.schedule.findMany({
      where: {
        enabled: true,
        timezone,
        time: {
          in: times,
        },
      },
    });
  }

  /** O agendamento com os controladores da sala, usado pelo worker. */
  async findByIdWithControllers(id: string) {
    return await this.prisma.schedule.findUnique({
      where: {
        id,
      },
      include: {
        room: {
          include: {
            controllers: true,
          },
        },
      },
    });
  }

  async findRun(scheduleId: string, scheduledFor: Date) {
    return await this.prisma.scheduleRun.findUnique({
      where: {
        scheduleId_scheduledFor: {
          scheduleId,
          scheduledFor,
        },
      },
    });
  }

  /**
   * Grava a execução e atualiza o `lastRunAt` na mesma transação, para que o
   * agendamento nunca fique dizendo que rodou sem existir o registro (ou o
   * contrário).
   */
  async createRun(data: CreateScheduleRunData) {
    return await this.prisma.$transaction([
      this.prisma.scheduleRun.create({
        data: {
          scheduleId: data.scheduleId,
          scheduledFor: data.scheduledFor,
          status: data.status,
          error: data.error,
        },
      }),
      this.prisma.schedule.update({
        where: {
          id: data.scheduleId,
        },
        data: {
          lastRunAt: data.scheduledFor,
        },
      }),
    ]);
  }

  async findRoomByIdAndOwner(roomId: string, ownerId: string) {
    return await this.prisma.room.findFirst({
      where: {
        id: roomId,
        block: {
          campus: {
            ownerId,
          },
        },
      },
    });
  }
}
