import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

import { AppConfigService } from './config.service';

@Injectable()
export class DatabaseConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
  ) {}

  get url(): string {
    return this.configService.get<string>('app.databaseUrl');
  }

  get logLevel(): (
    | 'info'
    | 'query'
    | 'warn'
    | 'error'
    | Prisma.LogDefinition
  )[] {
    const level: (
      | 'info'
      | 'query'
      | 'warn'
      | 'error'
      | Prisma.LogDefinition
    )[] = ['warn', 'error'];
    if (this.appConfigService.debug) {
      level.push('query', 'info');
    }
    return level;
  }

  get errorFormat(): Prisma.ErrorFormat {
    if (this.appConfigService.isDevelopment) {
      return 'colorless';
    } else {
      return 'minimal';
    }
  }
}
