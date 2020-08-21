import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { TeamspeakModule } from 'src/teamspeak/teamspeak.module';
import { DiscourseModule } from 'src/discourse/discourse.module';

@Module({
  imports: [AssignmentModule, TeamspeakModule, DiscourseModule],
  providers: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}
