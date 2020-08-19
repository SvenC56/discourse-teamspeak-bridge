import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DiscourseService } from './discourse.service';
import { AxiosResponse } from 'axios';

@Controller('discourse')
export class DiscourseController {
  constructor(private readonly discourseService: DiscourseService) {}

  @Get('groups')
  @ApiTags('discourse')
  groups(): Observable<AxiosResponse<any>> {
    return this.discourseService.getGroups();
  }

  @Get('users')
  @ApiTags('discourse')
  users(): Observable<AxiosResponse<any>> {
    return this.discourseService.getUsers();
  }
}
