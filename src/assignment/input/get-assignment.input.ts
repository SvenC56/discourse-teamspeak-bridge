import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class GetAssignmentInput {
  @IsNumberString()
  @IsOptional()
  @ApiProperty()
  id: number;
}
