import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoomDto } from "./dto/create-room";
import { RoomRepository } from "./repositories/room.repository";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { slugify } from "@/infra/utils/slug";
import { RoomOutput, roomOutputSchema } from "./dto/room-output";

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly cache: CacheRepository,
  ) {}

  private cacheKey(ownerId: string, id: string) {
    return `room:${ownerId}:${id}`;
  }

  async create(
    ownerId: string,
    blockId: string,
    body: CreateRoomDto,
  ): Promise<RoomOutput> {
    const block = await this.roomRepository.findBlockByIdAndOwner(
      blockId,
      ownerId,
    );

    if (!block) {
      throw new NotFoundException("Block not found");
    }

    const slug = slugify(body.name);

    const roomAlreadyExists = await this.roomRepository.findBySlugAndBlock(
      slug,
      blockId,
    );

    if (roomAlreadyExists) {
      throw new ConflictException("Room already exists");
    }

    const room = await this.roomRepository.create({
      name: body.name,
      slug,
      blockId,
    });

    const output = roomOutputSchema.parse(room);

    await this.cache.set(
      this.cacheKey(ownerId, room.id),
      JSON.stringify(output),
    );

    return output;
  }

  async get(ownerId: string, id: string): Promise<RoomOutput> {
    const cached = await this.cache.get(this.cacheKey(ownerId, id));

    if (cached) {
      const parsed = JSON.parse(cached);
      return roomOutputSchema.parse({
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      });
    }

    const room = await this.roomRepository.findByIdAndOwner(id, ownerId);

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const output = roomOutputSchema.parse(room);

    await this.cache.set(this.cacheKey(ownerId, id), JSON.stringify(output));

    return output;
  }

  async listByBlock(ownerId: string, blockId: string): Promise<RoomOutput[]> {
    const block = await this.roomRepository.findBlockByIdAndOwner(
      blockId,
      ownerId,
    );

    if (!block) {
      throw new NotFoundException("Block not found");
    }

    const rooms = await this.roomRepository.findManyByBlock(blockId);

    return rooms.map((room) => roomOutputSchema.parse(room));
  }
}
