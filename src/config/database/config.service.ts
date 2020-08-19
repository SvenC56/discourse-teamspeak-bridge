import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service dealing with database config based operations.
 *
 * @export
 * @class DatabaseConfigService
 * @implements {TypeOrmOptionsFactory}
 */
@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  /**
   * return TypeORM options
   *
   * @returns {TypeOrmModuleOptions}
   * @memberof DatabaseConfigService
   */
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.user'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
      synchronize: true,
      entities: this.configService.get<[string]>('database.entities'),
    };
  }
}
