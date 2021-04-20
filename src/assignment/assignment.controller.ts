import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateAssignmentInput } from './input/create-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { GetAssignmentInput } from './input/get-assignment.input';
import { AssignmentService } from './assignment.service';
import { Assignment, Prisma } from '@prisma/client';

@ApiTags('assignment')
@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create assignment' })
  createAssignment(
    @Body() createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.createAssignment(createAssignmentInput);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assignment' })
  updateAssignment(
    @Param() getAssignmentInput: GetAssignmentInput,
    @Body() updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.updateAssignment(
      getAssignmentInput,
      updateAssignmentInput,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  getAssignments(): Promise<Assignment[]> {
    return this.assignmentService.getAssignments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single assignment by ID' })
  getAssignment(
    @Param() getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.getAssignment(getAssignmentInput);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete single assignment by ID' })
  deleteAssignment(
    @Param() getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.deleteAssignment(getAssignmentInput);
  }
}
