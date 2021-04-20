import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule } from './config/app/config.module';
import { TeamspeakModule } from './teamspeak/teamspeak.module';
import { DiscourseModule } from './discourse/discourse.module';
import { AssignmentModule } from './assignment/assignment.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [
    AppConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend/dist'),
    }),
    ScheduleModule.forRoot(),
    TeamspeakModule,
    DiscourseModule,
    AssignmentModule,
    SyncModule,
  ],
})
export class AppModule {}
