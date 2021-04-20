import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { AppConfigService } from './config.service';
import configuration from './configuration';
import { DatabaseConfigService } from './database-config.service';

/**
 * Import and provide app configuration related classes.
 *
 * @export
 * @class AppConfigModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().empty('').default(3000),
        APP_DEBUG: Joi.boolean().default(false),
        APP_NAME: Joi.string().empty('').default('Discourse Teamspeak Sync'),
        DATABASE_URL: Joi.string().required(),
      }),
      cache: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [ConfigService, AppConfigService, DatabaseConfigService],
  exports: [AppConfigService, DatabaseConfigService],
})
export class AppConfigModule {}
