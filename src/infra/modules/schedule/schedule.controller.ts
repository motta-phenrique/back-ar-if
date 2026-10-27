import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decorater";
import type { TokenPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipes";
import { createScheduleBodySchema } from "./dto/create-schedule";
import type { CreateScheduleDto } from "./dto/create-schedule";
import { updateScheduleBodySchema } from "./dto/update-schedule";
import type { UpdateScheduleDto } from "./dto/update-schedule";

@UseGuards(AuthGuard("jwt"))
@Controller("schedule")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post("/:roomId")
  async create(
    @CurrentUser() user: TokenPayload,
    @Param("roomId") roomId: string,
    @Body(new ZodValidationPipe(createScheduleBodySchema))
    body: CreateScheduleDto,
  ) {
    return this.scheduleService.create(user.sub, roomId, body);
  }

  @Get("room/:roomId")
  async listByRoom(
    @CurrentUser() user: TokenPayload,
    @Param("roomId") roomId: string,
  ) {
    return this.scheduleService.listByRoom(user.sub, roomId);
  }

  @Get(":id")
  async get(@CurrentUser() user: TokenPayload, @Param("id") id: string) {
    return this.scheduleService.get(user.sub, id);
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateScheduleBodySchema))
    body: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(user.sub, id, body);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@CurrentUser() user: TokenPayload, @Param("id") id: string) {
    await this.scheduleService.remove(user.sub, id);
  }
}
