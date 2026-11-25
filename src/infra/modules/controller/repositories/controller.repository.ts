import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";

interface CreateControllerData {
  name: string;
  slug: string;
  roomId: string;
}

@Injectable()
export class ControllerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateControllerData) {
    return await this.prisma.controller.create({ data });
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    return await this.prisma.controller.findFirst({
      where: {
        id,
        room: { block: { campus: { ownerId } } },
      },
    });
  }

  async findBySlugAndRoom(slug: string, roomId: string) {
    return await this.prisma.controller.findUnique({
      where: { roomId_slug: { roomId, slug } },
    });
  }

  async findManyByRoom(roomId: string) {
    return await this.prisma.controller.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
    });
  }

  async delete(id: string) {
    await this.prisma.controller.delete({ where: { id } });
  }

  async findRoomByIdAndOwner(roomId: string, ownerId: string) {
    return await this.prisma.room.findFirst({
      where: {
        id: roomId,
        block: { campus: { ownerId } },
      },
    });
  }
}
