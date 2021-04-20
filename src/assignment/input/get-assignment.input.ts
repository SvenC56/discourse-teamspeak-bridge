import { Prisma } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class GetAssignmentInput implements Prisma.AssignmentWhereUniqueInput {
  @IsNumberString()
  @ApiProperty({ description: 'ID of the assignment', required: true })
  id: number;
}
