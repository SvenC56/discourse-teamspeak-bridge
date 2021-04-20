import { TeamSpeak } from 'ts3-nodejs-library';

export interface TeamSpeakConfig {
  host: string;
  port: number;
  query_port: number;
  protocol: TeamSpeak.QueryProtocol;
  username: string;
  password: string;
  nickname: string;
}
