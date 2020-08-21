import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/app/config.module';
import { DatabaseConfigService } from './config/database/config.service';
import { DatabaseConfigModule } from './config/database/config.module';
import { TeamspeakModule } from './teamspeak/teamspeak.module';
import { DiscourseModule } from './discourse/discourse.module';
import { AssignmentModule } from './assignment/assignment.module';
import { SyncModule } from './sync/sync.module';

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
    ScheduleModule.forRoot(),
    TeamspeakModule,
    DiscourseModule,
    AssignmentModule,
    SyncModule,
  ],
})
export class AppModule {}
