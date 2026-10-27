import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCampusDto } from "./dto/create-campus";
import { CampusRepository } from "./repositories/campus.repository";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { slugify } from "@/infra/utils/slug";
import { CampusOutput, campusOutputSchema } from "./dto/campus-output";
import type {
  ListCampusOutput,
  ListCampusQueryDto,
} from "./dto/list-campus";

@Injectable()
export class CampusService {
  constructor(
    private readonly campusRepository: CampusRepository,
    private readonly cache: CacheRepository,
  ) {}

  private cacheKey(ownerId: string, id: string) {
    return `campus:${ownerId}:${id}`;
  }

  async create(ownerId: string, body: CreateCampusDto): Promise<CampusOutput> {
    const slug = slugify(body.name);

    const campusAlreadyExists = await this.campusRepository.findBySlugAndOwner(
      slug,
      ownerId,
    );

    if (campusAlreadyExists) {
      throw new ConflictException("Campus already exists");
    }

    const campus = await this.campusRepository.create({
      name: body.name,
      slug,
      ownerId,
    });

    const output = campusOutputSchema.parse(campus);

    await this.cache.set(
      this.cacheKey(ownerId, campus.id),
      JSON.stringify(output),
    );

    return output;
  }

  async list(
    ownerId: string,
    { page, limit }: ListCampusQueryDto,
  ): Promise<ListCampusOutput> {
    const [data, total] = await Promise.all([
      this.campusRepository.findManyByOwner(ownerId, {
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.campusRepository.countByOwner(ownerId),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async get(ownerId: string, id: string): Promise<CampusOutput> {
    const cached = await this.cache.get(this.cacheKey(ownerId, id));

    if (cached) {
      const parsed = JSON.parse(cached);
      return campusOutputSchema.parse({
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      });
    }

    const campus = await this.campusRepository.findByIdAndOwner(id, ownerId);

    if (!campus) {
      throw new NotFoundException("Campus not found");
    }

    const output = campusOutputSchema.parse(campus);

    await this.cache.set(this.cacheKey(ownerId, id), JSON.stringify(output));

    return output;
  }
}
