import { registerAs } from '@nestjs/config';
import { QueryProtocol } from 'ts3-nodejs-library';

export default registerAs('teamspeak', () => ({
  host: process.env.TEAMSPEAK_HOST || 'localhost',
  port: parseInt(process.env.TEAMSPEAK_SERVER_PORT, 10) || 9987,
  query_port: parseInt(process.env.TEAMSPEAK_QUERY_PORT, 10) || 10011,
  protocol: process.env.TEAMSPEAK_PROTOCOL || QueryProtocol.RAW,
  user: process.env.TEAMSPEAK_USERNAME,
  password: process.env.TEAMSPEAK_PASSWORD,
  bot_name: process.env.TEAMSPEAK_BOT_NAME || 'Sync Bot',
}));
