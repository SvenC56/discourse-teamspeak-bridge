import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './configuration';
import { TeamspeakConfigService } from './config.service';
import { QueryProtocol } from 'ts3-nodejs-library';

/**
 * Import and provide teamspeak configuration related classes.
 *
 * @export
 * @class TeamspeakConfigModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        TEAMSPEAK_HOST: Joi.string().empty('').default('localhost'),
        TEAMSPEAK_SERVER_PORT: Joi.number().empty('').default(9987),
        TEAMSPEAK_QUERY_PORT: Joi.number().empty('').default(10011),
        TEAMSPEAK_PROTOCOL: Joi.string().empty('').default(QueryProtocol.RAW),
        TEAMSPEAK_USERNAME: Joi.string().required(),
        TEAMSPEAK_PASSWORD: Joi.string().required(),
        TEAMSPEAK_BOT_NAME: Joi.string().empty('').default('Sync Bot'),
      }),
      cache: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
  providers: [ConfigService, TeamspeakConfigService],
  exports: [TeamspeakConfigService],
})
export class TeamspeakConfigModule {}
