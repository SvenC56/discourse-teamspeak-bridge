import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateAssignmentInput } from './input/create-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { Assignment } from './assignment.entity';

@EntityRepository(Assignment)
export class AssignmentRepository extends Repository<Assignment> {
  async createAssignment(
    createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    const { name, shield, dcid, tsid } = createAssignmentInput;
    const date = new Date();

    const assignment = new Assignment();
    assignment.name = name;
    assignment.shield = shield;
    assignment.dcid = dcid;
    assignment.tsid = tsid;
    assignment.createdAt = date;
    assignment.updatedAt = date;

    try {
      await assignment.save();
    } catch (e) {
      this.errorHandler(e.code);
    }
    return assignment;
  }

  async updateAssignment(
    updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    const { id, name, shield, dcid, tsid } = updateAssignmentInput;
    const updatedAssignment = await this.findOne({ id });
    const date = new Date();

    if (!name && typeof shield === 'boolean' && !dcid && !tsid) {
      return updatedAssignment;
    }

    if (name) {
      updatedAssignment.name = name;
    }

    if (typeof shield === 'boolean') {
      updatedAssignment.shield = shield;
    }

    if (dcid) {
      updatedAssignment.dcid = dcid;
    }

    if (tsid) {
      updatedAssignment.tsid = tsid;
    }

    updatedAssignment.updatedAt = date;

    try {
      await this.update({ id }, updatedAssignment);
    } catch (e) {
      this.errorHandler(e.code);
    }

    return updatedAssignment;
  }

  private errorHandler(code) {
    switch (code) {
      case '23505':
        throw new ConflictException('name is already taken');
        break;

      default:
        throw new InternalServerErrorException();
        break;
    }
  }
}
