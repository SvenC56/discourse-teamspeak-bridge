import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type environment = 'production' | 'development' | 'test' | 'provision';

/**
 * Service dealing with app config based operations.
 *
 * @export
 * @class AppConfigService
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * @returns boolean
   */
  get isProduction(): boolean {
    return this.env === 'production';
  }

  /**
   * @returns boolean
   */
  get isDevelopment(): boolean {
    return this.env === 'development';
  }

  /**
   * return application name
   *
   * @readonly
   * @type {string}
   * @memberof AppConfigService
   */
  get name(): string {
    return this.configService.get<string>('app.name');
  }

  /**
   * return application environment
   *
   * @readonly
   * @type {string}
   * @memberof AppConfigService
   */
  get env(): string {
    return this.configService.get<string>('app.env');
  }

  /**
   * return port number of application
   *
   * @readonly
   * @type {number}
   * @memberof AppConfigService
   */
  get port(): number {
    return Number(this.configService.get<number>('app.port'));
  }

  /**
   * return debug mode of application
   *
   * @readonly
   * @type {boolean}
   * @memberof AppConfigService
   */
  get debug(): boolean {
    return this.configService.get<boolean>('app.debug');
  }
}
