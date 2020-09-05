import { Module } from '@nestjs/common';
import configuration from './configuration';
import { DiscourseConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    }),
  ],
  providers: [ConfigService, DiscourseConfigService],
  exports: [DiscourseConfigService],
})
export class DiscourseConfigModule {}
