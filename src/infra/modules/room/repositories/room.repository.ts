import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";

interface CreateRoomData {
  name: string;
  slug: string;
  blockId: string;
}

@Injectable()
export class RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoomData) {
    return await this.prisma.room.create({
      data: {
        name: data.name,
        slug: data.slug,
        blockId: data.blockId,
      },
    });
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    return await this.prisma.room.findFirst({
      where: {
        id,
        block: {
          campus: {
            ownerId,
          },
        },
      },
    });
  }

  async findBySlugAndBlock(slug: string, blockId: string) {
    return await this.prisma.room.findUnique({
      where: {
        blockId_slug: {
          blockId,
          slug,
        },
      },
    });
  }

  async findManyByBlock(blockId: string) {
    return await this.prisma.room.findMany({
      where: {
        blockId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findBlockByIdAndOwner(blockId: string, ownerId: string) {
    return await this.prisma.block.findFirst({
      where: {
        id: blockId,
        campus: {
          ownerId,
        },
      },
    });
  }
}
