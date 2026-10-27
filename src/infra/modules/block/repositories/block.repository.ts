import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";

interface CreateBlockData {
  name: string;
  slug: string;
  campusId: string;
}

@Injectable()
export class BlockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBlockData) {
    return await this.prisma.block.create({
      data: {
        name: data.name,
        slug: data.slug,
        campusId: data.campusId,
      },
    });
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    return await this.prisma.block.findFirst({
      where: {
        id,
        campus: {
          ownerId,
        },
      },
    });
  }

  async findBySlugAndCampus(slug: string, campusId: string) {
    return await this.prisma.block.findUnique({
      where: {
        campusId_slug: {
          campusId,
          slug,
        },
      },
    });
  }

  async findManyByCampus(campusId: string) {
    return await this.prisma.block.findMany({
      where: {
        campusId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findCampusByIdAndOwner(campusId: string, ownerId: string) {
    return await this.prisma.campus.findFirst({
      where: {
        id: campusId,
        ownerId,
      },
    });
  }
}
