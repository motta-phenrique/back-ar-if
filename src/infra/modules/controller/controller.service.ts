import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ControllerRepository } from "./repositories/controller.repository";
import { CreateControllerDto } from "./dto/create-controller";
import {
  ControllerOutput,
  controllerOutputSchema,
} from "./dto/controller-output";
import { slugify } from "@/infra/utils/slug";
import { UpdateStateDto } from "./dto/update-state";
import { ControllerStateService } from "@/infra/dispatch/controller-state.service";

@Injectable()
export class ControllerService {
  constructor(
    private readonly controllerRepository: ControllerRepository,
    private readonly controllerState: ControllerStateService,
  ) {}

  async create(
    ownerId: string,
    roomId: string,
    body: CreateControllerDto,
  ): Promise<ControllerOutput> {
    const room = await this.controllerRepository.findRoomByIdAndOwner(
      roomId,
      ownerId,
    );

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const slug = slugify(body.name);

    const alreadyExists = await this.controllerRepository.findBySlugAndRoom(
      slug,
      roomId,
    );

    if (alreadyExists) {
      throw new ConflictException("Controller already exists");
    }

    const controller = await this.controllerRepository.create({
      name: body.name,
      slug,
      roomId,
    });

    return controllerOutputSchema.parse(controller);
  }

  async listByRoom(
    ownerId: string,
    roomId: string,
  ): Promise<ControllerOutput[]> {
    const room = await this.controllerRepository.findRoomByIdAndOwner(
      roomId,
      ownerId,
    );

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const controllers = await this.controllerRepository.findManyByRoom(roomId);

    return controllers.map((c) => controllerOutputSchema.parse(c));
  }

  async get(ownerId: string, id: string): Promise<ControllerOutput> {
    const controller = await this.controllerRepository.findByIdAndOwner(
      id,
      ownerId,
    );

    if (!controller) {
      throw new NotFoundException("Controller not found");
    }

    return controllerOutputSchema.parse(controller);
  }

  /** Muda só os campos enviados; o resto sai do último estado salvo. */
  async updateState(
    ownerId: string,
    id: string,
    body: UpdateStateDto,
  ): Promise<ControllerOutput> {
    const controller = await this.controllerRepository.findByIdAndOwner(
      id,
      ownerId,
    );

    if (!controller) {
      throw new NotFoundException("Controller not found");
    }

    try {
      const state = await this.controllerState.apply(controller, body);
      return controllerOutputSchema.parse({ ...controller, ...state });
    } catch (error) {
      throw new ServiceUnavailableException((error as Error).message);
    }
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const controller = await this.controllerRepository.findByIdAndOwner(
      id,
      ownerId,
    );

    if (!controller) {
      throw new NotFoundException("Controller not found");
    }

    await this.controllerRepository.delete(id);
  }
}
