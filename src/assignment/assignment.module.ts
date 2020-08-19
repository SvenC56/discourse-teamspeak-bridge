import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { DiscourseModule } from 'src/discourse/discourse.module';
import { TeamspeakModule } from 'src/teamspeak/teamspeak.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentRepository } from './assignment.repository';

@Module({
  imports: [
    DiscourseModule,
    TeamspeakModule,
    TypeOrmModule.forFeature([AssignmentRepository]),
  ],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
