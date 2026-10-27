import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '../../../generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {   
  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL');

    // O driver `pg` ignora o `?schema=` da URL, então ele precisa ser
    // repassado explicitamente ao adapter.
    const schema =
      new URL(connectionString).searchParams.get('schema') ?? 'public';

    const adapter = new PrismaPg({ connectionString }, { schema });

    super({ adapter, log: ['query'] });
  }
  
  async onModuleInit() {
    await this.$connect();
  }
  
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
