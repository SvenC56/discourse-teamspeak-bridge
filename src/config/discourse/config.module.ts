import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { DiscourseConfigService } from './config.service';
import configuration from './configuration';

/**
 * Import and provide discourse configuration related classes.
 *
 * @export
 * @class DiscourseConfigModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        DISCOURSE_API_KEY: Joi.string().required(),
        DISCOURSE_USER_LIST_QUERY_ID: Joi.number().required(),
        APP_DEBUG: Joi.boolean().default(false),
        DISCOURSE_URL: Joi.string().empty('').default('http://localhost'),
        DISCOURSE_USER: Joi.string().required(),
        DISCOURSE_CUSTOM_FIELD_NAME: Joi.string().required(),
        DISCOURSE_WEBHOOK_SECRET: Joi.string().required(),
      }),
      cache: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [ConfigService, DiscourseConfigService],
  exports: [DiscourseConfigService],
})
export class DiscourseConfigModule {}
