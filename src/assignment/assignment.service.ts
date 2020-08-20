import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscourseService } from 'src/discourse/discourse.service';
import { TeamspeakService } from 'src/teamspeak/teamspeak.service';
import { CreateAssignmentInput } from './input/create-assignment.input';
import { GetAssignmentInput } from './input/get-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { Assignment } from './assignment.entity';
import { AssignmentRepository } from './assignment.repository';

@Injectable()
export class AssignmentService {
  private readonly logger = new Logger(AssignmentService.name);

  constructor(
    private readonly discourseService: DiscourseService,
    private readonly teamspeakService: TeamspeakService,
    @InjectRepository(AssignmentRepository)
    private readonly assignmentRepository: AssignmentRepository,
  ) {}

  async createAssignment(
    createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentRepository.createAssignment(createAssignmentInput);
  }

  async updateAssignment(
    updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentRepository.updateAssignment(updateAssignmentInput);
  }

  async getAssignments(): Promise<Assignment[]> {
    return this.assignmentRepository.find();
  }

  async getAssignment(
    getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    const { id } = getAssignmentInput;
    return this.assignmentRepository.findOne(+id);
  }
}
