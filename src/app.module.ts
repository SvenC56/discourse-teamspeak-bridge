import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppConfigModule } from './config/app/config.module';
import { DatabaseConfigService } from './config/database/config.service';
import { DatabaseConfigModule } from './config/database/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamspeakModule } from './teamspeak/teamspeak.module';
import { DiscourseModule } from './discourse/discourse.module';

@Module({
  imports: [
    AppConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client/dist'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      useExisting: DatabaseConfigService,
    }),
    TeamspeakModule,
    DiscourseModule,
  ],
})
export class AppModule {}
