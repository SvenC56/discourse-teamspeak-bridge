import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  TeamSpeakChannel,
  TeamSpeakClient,
  TeamSpeakServerGroup,
} from 'ts3-nodejs-library';
import {
  InstanceInfo,
  ServerInfo,
  Whoami,
} from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { TeamspeakService } from './teamspeak.service';

@Controller('teamspeak')
export class TeamspeakController {
  constructor(private readonly teamspeakService: TeamspeakService) {}

  @Get('whoami')
  @ApiTags('teamspeak')
  @ApiOperation({ summary: 'Get TeamSpeak - Who Am I?' })
  whoami(): Promise<Whoami> {
    return this.teamspeakService.getWhoami();
  }

  @Get('serverinfo')
  @ApiTags('teamspeak')
  serverInfo(): Promise<ServerInfo> {
    return this.teamspeakService.getServerInfo();
  }

  @Get('instanceinfo')
  @ApiTags('teamspeak')
  instanceInfo(): Promise<InstanceInfo> {
    return this.teamspeakService.getInstanceInfo();
  }

  @Get('clientlist')
  @ApiTags('teamspeak')
  clientList(): Promise<TeamSpeakClient[]> {
    return this.teamspeakService.clientList();
  }

  @Get('servergrouplist')
  @ApiTags('teamspeak')
  serverGroupList(): Promise<TeamSpeakServerGroup[]> {
    return this.teamspeakService.getServerGroups();
  }

  @Get('channellist')
  @ApiTags('teamspeak')
  channelList(): Promise<TeamSpeakChannel[]> {
    return this.teamspeakService.getChannels();
  }

  @Get('servergrouplist/:pid')
  @ApiTags('teamspeak')
  subChannelList(@Param('pid') pid: string): Promise<TeamSpeakChannel[]> {
    return this.teamspeakService.getSubChannels(pid);
  }
}
