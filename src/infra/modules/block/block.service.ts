import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateBlockDto } from "./dto/create-block";
import { BlockRepository } from "./repositories/block.repository";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { slugify } from "@/infra/utils/slug";
import { BlockOutput, blockOutputSchema } from "./dto/block-output";

@Injectable()
export class BlockService {
  constructor(
    private readonly blockRepository: BlockRepository,
    private readonly cache: CacheRepository,
  ) {}

  private cacheKey(ownerId: string, id: string) {
    return `block:${ownerId}:${id}`;
  }

  async create(
    ownerId: string,
    campusId: string,
    body: CreateBlockDto,
  ): Promise<BlockOutput> {
    const campus = await this.blockRepository.findCampusByIdAndOwner(
      campusId,
      ownerId,
    );

    if (!campus) {
      throw new NotFoundException("Campus not found");
    }

    const slug = slugify(body.name);

    const blockAlreadyExists = await this.blockRepository.findBySlugAndCampus(
      slug,
      campusId,
    );

    if (blockAlreadyExists) {
      throw new ConflictException("Block already exists");
    }

    const block = await this.blockRepository.create({
      name: body.name,
      slug,
      campusId,
    });

    const output = blockOutputSchema.parse(block);

    await this.cache.set(
      this.cacheKey(ownerId, block.id),
      JSON.stringify(output),
    );

    return output;
  }

  async get(ownerId: string, id: string): Promise<BlockOutput> {
    const cached = await this.cache.get(this.cacheKey(ownerId, id));

    if (cached) {
      const parsed = JSON.parse(cached);
      return blockOutputSchema.parse({
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      });
    }

    const block = await this.blockRepository.findByIdAndOwner(id, ownerId);

    if (!block) {
      throw new NotFoundException("Block not found");
    }

    const output = blockOutputSchema.parse(block);

    await this.cache.set(this.cacheKey(ownerId, id), JSON.stringify(output));

    return output;
  }

  async listByCampus(ownerId: string, campusId: string): Promise<BlockOutput[]> {
    const campus = await this.blockRepository.findCampusByIdAndOwner(
      campusId,
      ownerId,
    );

    if (!campus) {
      throw new NotFoundException("Campus not found");
    }

    const blocks = await this.blockRepository.findManyByCampus(campusId);

    return blocks.map((block) => blockOutputSchema.parse(block));
  }
}
