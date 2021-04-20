import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiscourseService } from './discourse.service';
import { DiscourseUser } from './discourse-user.interface';
import { DiscourseGroup } from './interface/discourse-group.interface';

@Controller('discourse')
@ApiTags('discourse')
export class DiscourseController {
  constructor(private readonly discourseService: DiscourseService) {}

  @Get('groups')
  @ApiOperation({ summary: 'Discourse - Group List' })
  groups(): Promise<DiscourseGroup[]> {
    return this.discourseService.getGroups();
  }

  @Get('users')
  @ApiOperation({ summary: 'Discourse - User List' })
  users(): Promise<DiscourseUser[]> {
    return this.discourseService.getUsers();
  }
}
