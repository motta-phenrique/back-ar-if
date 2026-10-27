import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { CreateAccountDto } from "../dto/create-account";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findUserByEmail(email: string) {
      return await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    }

    async findUserById(id: string) {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    }
    
    async createUser(data: CreateAccountDto) {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
    }
}
