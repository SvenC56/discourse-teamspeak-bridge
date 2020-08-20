import { Injectable, Logger } from '@nestjs/common';
import { TeamspeakConfigService } from 'src/config/teamspeak/config.service';
// TeamSpeak
import {
  TeamSpeak,
  TeamSpeakChannel,
  TeamSpeakClient,
  TeamSpeakServerGroup,
} from 'ts3-nodejs-library';
import {
  InstanceInfo,
  ServerInfo,
  Whoami,
} from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { GetParentIdInput } from './input/get-parent-id.input';

@Injectable()
export class TeamspeakService {
  private readonly logger = new Logger(TeamspeakService.name);

  teamspeak: TeamSpeak;
  constructor(private readonly teamspeakConfig: TeamspeakConfigService) {
    this.teamspeak = new TeamSpeak(teamspeakConfig.config);

    this.teamspeak.on('close', async () => {
      await this.teamspeak.reconnect(-1, 1000);
    });

    this.teamspeak.on('error', (e) => {
      this.logger.error(e.message);
      switch (true) {
        case /^could not fetch client/.test(e.message): {
          break;
        }
        default: {
          break;
        }
      }
    });

    this.teamspeak.on('ready', async () => {
      this.logger.log('Connected to TeamSpeak Server!');
      await this.teamspeak.useByPort(
        teamspeakConfig.serverPort,
        teamspeakConfig.nickname,
      );
    });
  }

  async getWhoami(): Promise<Whoami> {
    try {
      return this.teamspeak.whoami();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getServerInfo(): Promise<ServerInfo> {
    try {
      return this.teamspeak.serverInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getInstanceInfo(): Promise<InstanceInfo> {
    try {
      return this.teamspeak.instanceInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getServerGroups(): Promise<TeamSpeakServerGroup[]> {
    try {
      return this.teamspeak.serverGroupList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getChannels(): Promise<TeamSpeakChannel[]> {
    try {
      return this.teamspeak.channelList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getSubChannels(
    getParentIdInput: GetParentIdInput,
  ): Promise<TeamSpeakChannel[]> {
    const { pid } = getParentIdInput;
    try {
      return this.teamspeak.channelList({ pid });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async clientList(): Promise<TeamSpeakClient[]> {
    try {
      return this.teamspeak.clientList({ clientType: 0 });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  // async addClientUserGroup(client, sgArray) {
  //   try {
  //     sgArray.forEach(async (sgid) => {
  //       await this.ts.serverGroupAddClient(client.databaseId, sgid);
  //     });
  //     const groupNames = await getGroupNames(sgArray);
  //   } catch (e) {
  //     this.logger.error(e.message);
  //   }
  // }
}

// async function getGroupNames(sgArray) {
//   const groupNames = [];
//   await asyncForEach(sgArray, async (tsId) => {
//     const result = await database.readSingleAssignmentByTsId(tsId);
//     groupNames.push(result.name);
//   });
//   return groupNames;
// }

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// }
