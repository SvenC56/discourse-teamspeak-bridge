import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  @ApiTags('sync')
  @ApiOperation({ summary: 'Sync all users online in TeamSpeak' })
  groups(): Promise<any> {
    return this.syncService.compareAllUsers();
  }
}
