import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";

interface CreateCampusData {
  name: string;
  slug: string;
  ownerId: string;
}

interface PaginationParams {
  skip: number;
  take: number;
}

@Injectable()
export class CampusRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCampusData) {
    return await this.prisma.campus.create({
      data: {
        name: data.name,
        slug: data.slug,
        ownerId: data.ownerId,
      },
    });
  }

  async findByIdAndOwner(id: string, ownerId: string) {
    return await this.prisma.campus.findFirst({
      where: {
        id,
        ownerId,
      },
    });
  }

  async findBySlugAndOwner(slug: string, ownerId: string) {
    return await this.prisma.campus.findUnique({
      where: {
        ownerId_slug: {
          ownerId,
          slug,
        },
      },
    });
  }

  async findManyByOwner(ownerId: string, { skip, take }: PaginationParams) {
    return await this.prisma.campus.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });
  }

  async countByOwner(ownerId: string) {
    return await this.prisma.campus.count({
      where: {
        ownerId,
      },
    });
  }
}
