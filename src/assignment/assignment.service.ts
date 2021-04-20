import { Injectable, Logger } from '@nestjs/common';
import { CreateAssignmentInput } from './input/create-assignment.input';
import { GetAssignmentInput } from './input/get-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { Prisma, Assignment } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentService {
  private readonly logger = new Logger(AssignmentService.name);

  constructor(private prisma: PrismaService) {}

  async createAssignment(
    createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    const { dcid, name, shield, tsid } = createAssignmentInput;

    const assignment = await this.prisma.assignment.create({
      data: { name, tsid, dcid, shield },
    });

    this.logger.log(`Assignment ID: "${assignment.id}" was created.`);

    return assignment;
  }

  async updateAssignment(
    getAssignmentInput: GetAssignmentInput,
    updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    const { dcid, name, shield, tsid } = updateAssignmentInput;

    const assignment = await this.prisma.assignment.update({
      where: getAssignmentInput,
      data: { dcid, name, shield, tsid },
    });

    this.logger.log(`Assignment ID: "${assignment.id}" was updated.`);

    return assignment;
  }

  async getAssignments(): Promise<Assignment[]> {
    return this.prisma.assignment.findMany();
  }

  async getAssignment(
    getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    return this.prisma.assignment.findUnique({ where: getAssignmentInput });
  }

  async deleteAssignment(
    getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    const result = await this.prisma.assignment.delete({
      where: getAssignmentInput,
    });

    this.logger.log(`Assignment ID: "${result.id}" was deleted.`);

    return result;
  }
}
