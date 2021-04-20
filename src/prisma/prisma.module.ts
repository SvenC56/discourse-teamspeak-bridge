import { Module } from "@nestjs/common";
import { AppConfigModule } from "../config/app/config.module";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [AppConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
