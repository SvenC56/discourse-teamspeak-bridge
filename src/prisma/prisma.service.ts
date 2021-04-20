import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { DatabaseConfigService } from "../config/app/database-config.service";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly databaseConfigService: DatabaseConfigService) {
    super({
      datasources: { db: { url: databaseConfigService.url } },
      log: databaseConfigService.logLevel,
      errorFormat: databaseConfigService.errorFormat,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
