import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAssignmentInput } from './input/create-assignment.input';
import { UpdateAssignmentInput } from './input/update-assignment.input';
import { GetAssignmentInput } from './input/get-assignment.input';
import { Assignment } from './assignment.entity';
import { AssignmentService } from './assignment.service';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create assignment' })
  @ApiTags('assignment')
  @ApiResponse({
    type: Assignment,
  })
  createSync(
    @Body() createAssignmentInput: CreateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.createSync(createAssignmentInput);
  }

  @Patch()
  @ApiOperation({ summary: 'Update assignment' })
  @ApiTags('assignment')
  @ApiResponse({
    type: Assignment,
  })
  updateSync(
    @Body() updateAssignmentInput: UpdateAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.updateSync(updateAssignmentInput);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assignments' })
  @ApiTags('assignment')
  getSyncs(): Promise<Assignment[]> {
    return this.assignmentService.getSyncs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single assignment' })
  @ApiTags('assignment')
  @ApiResponse({
    type: Assignment,
  })
  getSync(
    @Param() getAssignmentInput: GetAssignmentInput,
  ): Promise<Assignment> {
    return this.assignmentService.getSync(getAssignmentInput);
  }
}
