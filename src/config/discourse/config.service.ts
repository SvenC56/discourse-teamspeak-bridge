import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DiscourseConfig } from './discourse-config.interface';

/**
 * Service dealing with teamspeak config based operations.
 *
 * @export
 * @class DiscourseConfigService
 */
@Injectable()
export class DiscourseConfigService {
  constructor(private configService: ConfigService) {}

  get url(): string {
    return this.configService.get<string>('discourse.url');
  }

  get custom_field_name(): string {
    return this.configService.get<string>('discourse.custom_field_name');
  }

  get api_key(): string {
    return this.configService.get<string>('discourse.api_key');
  }

  get user(): string {
    return this.configService.get<string>('discourse.user');
  }

  get user_list_query_id(): number {
    return this.configService.get<number>('discourse.user_list_query_id');
  }

  get discourseConfig(): DiscourseConfig {
    return {
      url: this.configService.get<string>('discourse.url'),
      user_list_query_id: this.configService.get<number>(
        'discourse.user_list_query_id',
      ),
      api_key: this.configService.get<string>('discourse.api_key'),
      user: this.configService.get<string>('discourse.user'),
      custom_field_name: this.configService.get<string>(
        'discourse.custom_field_name',
      ),
      webhook_secret: this.configService.get<string>(
        'discourse.webhook_secret',
      ),
    };
  }
}
