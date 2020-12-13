import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { TeamspeakConfigService } from 'src/config/teamspeak/config.service';
import { SyncService } from 'src/sync/sync.service';
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
export class TeamspeakService extends TeamSpeak {
  private readonly logger = new Logger(TeamspeakService.name);

  constructor(
    private readonly teamspeakConfig: TeamspeakConfigService,
    @Inject(forwardRef(() => SyncService))
    private readonly syncService: SyncService,
  ) {
    super(teamspeakConfig.config);

    this.on('close', async () => {
      await this.reconnect(-1, 1000);
    });

    this.on('error', (e) => {
      switch (true) {
        case /^could not fetch client/.test(e.message): {
          this.logger.debug(e.message);
          break;
        }
        default: {
          this.logger.error(e.message);
          break;
        }
      }
    });

    // this.teamspeak.on('debug', (event) => {
    //   this.logger.debug(event);
    // });

    this.on('ready', async () => {
      this.logger.log('Connected to TeamSpeak Server!');
      await this.useByPort(
        teamspeakConfig.serverPort,
        teamspeakConfig.nickname,
      );

      await Promise.all([this.registerEvent('server')]);

      this.on('clientconnect', async (event) => {
        this.syncService.compareSingleUser(event.client);
      });
    });
  }

  async getWhoami(): Promise<Whoami> {
    try {
      return this.whoami();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getServerInfo(): Promise<ServerInfo> {
    try {
      return this.serverInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getInstanceInfo(): Promise<InstanceInfo> {
    try {
      return this.instanceInfo();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getServerGroups(): Promise<TeamSpeakServerGroup[]> {
    try {
      return this.serverGroupList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getChannels(): Promise<TeamSpeakChannel[]> {
    try {
      return this.channelList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async getSubChannels(
    getParentIdInput: GetParentIdInput,
  ): Promise<TeamSpeakChannel[]> {
    const { pid } = getParentIdInput;
    try {
      return this.channelList({ pid });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async clientList(): Promise<TeamSpeakClient[]> {
    try {
      return this.clientList();
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async addClientServerGroup(
    teamspeakClient: TeamSpeakClient,
    sgArray: number[],
  ): Promise<any> {
    try {
      return this.asyncForEach(sgArray, async (sg) => {
        return this.serverGroupAddClient(teamspeakClient.databaseId, sg);
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async removeClientServerGroup(
    teamspeakClient: TeamSpeakClient,
    sgArray: number[],
  ): Promise<any> {
    try {
      return this.asyncForEach(sgArray, async (sg) => {
        return this.serverGroupDelClient(teamspeakClient.databaseId, sg);
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async sendClientTextMessage(
    teamspeakClient: TeamSpeakClient,
    message: string,
  ): Promise<any> {
    try {
      this.sendTextMessage(teamspeakClient.clid, 1, message);
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  private async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
