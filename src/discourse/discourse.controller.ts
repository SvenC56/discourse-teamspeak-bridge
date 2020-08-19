import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DiscourseService } from './discourse.service';
import { AxiosResponse } from 'axios';
import { DiscourseUser } from './discourse-user.interface';
import { DiscourseGroup } from './discourse-group.interface';

@Controller('discourse')
export class DiscourseController {
  constructor(private readonly discourseService: DiscourseService) {}

  @Get('groups')
  @ApiTags('discourse')
  groups(): Observable<AxiosResponse<DiscourseGroup[]>> {
    return this.discourseService.getGroups();
  }

  @Get('users')
  @ApiTags('discourse')
  users(): Observable<AxiosResponse<DiscourseUser[]>> {
    return this.discourseService.getUsers();
  }
}
