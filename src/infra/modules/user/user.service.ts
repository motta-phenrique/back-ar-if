import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { hash, compare } from "bcryptjs";
import type { CreateAccountDto } from "./dto/create-account";
import type { SessionAccountDto } from "./dto/session-account";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./repositories/user.repository";
import { userOutputSchema, type UserOutput } from "./dto/user-output";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(body: CreateAccountDto) {
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      body.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await hash(body.password, 8);

    await this.userRepository.createUser({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });
  }

  async session(body: SessionAccountDto) {
    const user = await this.userRepository.findUserByEmail(body.email);
    
    if (!user) {
      throw new UnauthorizedException("Credentials invalid");
    }

    const isPasswordValid = await compare(body.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credentials invalid");
    }

    const token = this.jwtService.sign({ sub: user.id });

    return {
      token,
    };
  }

  async me(userId: string): Promise<UserOutput> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return userOutputSchema.parse(user);
  }
}
