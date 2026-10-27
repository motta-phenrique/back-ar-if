import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ScheduleRepository } from "./repositories/schedule.repository";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { slugify } from "@/infra/utils/slug";
import { ScheduleOutput, scheduleOutputSchema } from "./dto/schedule-output";
import type { CreateScheduleDto } from "./dto/create-schedule";
import type { UpdateScheduleDto } from "./dto/update-schedule";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly cache: CacheRepository,
  ) {}

  private cacheKey(ownerId: string, id: string) {
    return `schedule:${ownerId}:${id}`;
  }

  private reviveDates(parsed: Record<string, unknown>) {
    return {
      ...parsed,
      startsAt: parsed.startsAt ? new Date(parsed.startsAt as string) : null,
      endsAt: parsed.endsAt ? new Date(parsed.endsAt as string) : null,
      lastRunAt: parsed.lastRunAt ? new Date(parsed.lastRunAt as string) : null,
      createdAt: new Date(parsed.createdAt as string),
      updatedAt: new Date(parsed.updatedAt as string),
    };
  }

  async create(
    ownerId: string,
    roomId: string,
    body: CreateScheduleDto,
  ): Promise<ScheduleOutput> {
    const room = await this.scheduleRepository.findRoomByIdAndOwner(
      roomId,
      ownerId,
    );

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const slug = slugify(body.name);

    const scheduleAlreadyExists =
      await this.scheduleRepository.findBySlugAndRoom(slug, roomId);

    if (scheduleAlreadyExists) {
      throw new ConflictException("Schedule already exists");
    }

    const schedule = await this.scheduleRepository.create({
      ...body,
      slug,
      roomId,
      createdById: ownerId,
    });

    const output = scheduleOutputSchema.parse(schedule);

    await this.cache.set(
      this.cacheKey(ownerId, schedule.id),
      JSON.stringify(output),
    );

    return output;
  }

  async get(ownerId: string, id: string): Promise<ScheduleOutput> {
    const cached = await this.cache.get(this.cacheKey(ownerId, id));

    if (cached) {
      return scheduleOutputSchema.parse(this.reviveDates(JSON.parse(cached)));
    }

    const schedule = await this.scheduleRepository.findByIdAndOwner(id, ownerId);

    if (!schedule) {
      throw new NotFoundException("Schedule not found");
    }

    const output = scheduleOutputSchema.parse(schedule);

    await this.cache.set(this.cacheKey(ownerId, id), JSON.stringify(output));

    return output;
  }

  async listByRoom(
    ownerId: string,
    roomId: string,
  ): Promise<ScheduleOutput[]> {
    const room = await this.scheduleRepository.findRoomByIdAndOwner(
      roomId,
      ownerId,
    );

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const schedules = await this.scheduleRepository.findManyByRoom(roomId);

    return schedules.map((schedule) => scheduleOutputSchema.parse(schedule));
  }

  async update(
    ownerId: string,
    id: string,
    body: UpdateScheduleDto,
  ): Promise<ScheduleOutput> {
    const schedule = await this.scheduleRepository.findByIdAndOwner(id, ownerId);

    if (!schedule) {
      throw new NotFoundException("Schedule not found");
    }

    // O schema do body só enxerga os campos enviados, então a janela precisa
    // ser revalidada contra o que já está gravado.
    const startsAt = body.startsAt ?? schedule.startsAt;
    const endsAt = body.endsAt ?? schedule.endsAt;

    if (startsAt && endsAt && startsAt > endsAt) {
      throw new BadRequestException("endsAt must be after startsAt");
    }

    const slug = body.name ? slugify(body.name) : undefined;

    if (slug && slug !== schedule.slug) {
      const scheduleAlreadyExists =
        await this.scheduleRepository.findBySlugAndRoom(slug, schedule.roomId);

      if (scheduleAlreadyExists) {
        throw new ConflictException("Schedule already exists");
      }
    }

    const updated = await this.scheduleRepository.update(id, {
      ...body,
      slug,
    });

    const output = scheduleOutputSchema.parse(updated);

    await this.cache.set(this.cacheKey(ownerId, id), JSON.stringify(output));

    return output;
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const schedule = await this.scheduleRepository.findByIdAndOwner(id, ownerId);

    if (!schedule) {
      throw new NotFoundException("Schedule not found");
    }

    await this.scheduleRepository.delete(id);
    await this.cache.delete(this.cacheKey(ownerId, id));
  }
}
