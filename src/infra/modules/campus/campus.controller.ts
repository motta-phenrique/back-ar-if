import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CampusService } from "./campus.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decorater";
import type { TokenPayload } from "@/infra/auth/jwt.strategy";
import type { CreateCampusDto } from "./dto/create-campus";
import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipes";
import { createCampusBodySchema } from "./dto/create-campus";
import {
  listCampusQuerySchema,
  type ListCampusQueryDto,
} from "./dto/list-campus";

@UseGuards(AuthGuard("jwt"))
@Controller("campus")
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Post()
  async create(
    @CurrentUser() user: TokenPayload,
    @Body(new ZodValidationPipe(createCampusBodySchema)) body: CreateCampusDto,
  ) {
    return this.campusService.create(user.sub, body);
  }

  @Get()
  async list(
    @CurrentUser() user: TokenPayload,
    @Query(new ZodValidationPipe(listCampusQuerySchema))
    query: ListCampusQueryDto,
  ) {
    return this.campusService.list(user.sub, query);
  }

  @Get(":id")
  async get(@CurrentUser() user: TokenPayload, @Param("id") id: string) {
    return this.campusService.get(user.sub, id);
  }
}
