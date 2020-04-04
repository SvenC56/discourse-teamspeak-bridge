import convict from 'convict'
import logger from './winston'

// Define a schema
var config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  baseUrl: {
    doc: 'The base url the app is running on.',
    format: '*',
    default: 'http://localhost:8080',
    env: 'BASE_URL',
  },
  port: {
    doc: 'The port the app is listening to.',
    format: '*',
    default: '8080',
    env: 'PORT',
  },
  cronInterval: {
    doc: 'The interval used for the cron job.',
    format: '*',
    default: '* * * * *',
    env: 'CRON_INTERVAL',
  },
  teamspeak: {
    host: {
      doc: 'The TeamSpeak server host address.',
      format: '*',
      default: 'localhost',
      env: 'TEAMSPEAK_HOST',
    },
    serverPort: {
      doc: 'The TeamSpeak server port.',
      format: 'port',
      default: 9987,
      env: 'TEAMSPEAK_SERVER_PORT',
    },
    queryPort: {
      doc: 'The TeamSpeak query port.',
      format: 'port',
      default: 10011,
      env: 'TEAMSPEAK_QUERY_PORT',
    },
    botName: {
      doc: 'The Bot name.',
      format: '*',
      default: 'Bot',
      env: 'TEAMSPEAK_BOT_NAME',
    },
    protocol: {
      doc: 'The TeamSpeak query protocol (ssh or raw).',
      format: ['ssh', 'raw'],
      default: 'raw',
      env: 'TEAMSPEAK_PROTOCOL',
    },
    username: {
      doc: 'The TeamSpeak query username.',
      format: '*',
      default: 'serveradmin',
      env: 'TEAMSPEAK_USERNAME',
    },
    password: {
      doc: 'The TeamSpeak query password.',
      format: '*',
      default: '',
      env: 'TEAMSPEAK_PASSWORD',
    },
  },
  discourse: {
    host: {
      doc: 'The Discourse server host address.',
      format: '*',
      default: 'localhost',
      env: 'DISCOURSE_URL',
    },
    apikey: {
      doc: 'The Discourse api key.',
      format: '*',
      default: '',
      env: 'DISCOURSE_API_KEY',
    },
    user: {
      doc: 'The Discourse api user.',
      format: '*',
      default: 'system',
      env: 'DISCOURSE_USER',
    },
    custom_field_name: {
      doc: 'The Discourse custom field name.',
      format: '*',
      default: '',
      env: 'DISCOURSE_CUSTOM_FIELD_NAME',
    },
    query_id: {
      doc: 'The Discourse user list query ID.',
      format: '*',
      default: '',
      env: 'DISCOURSE_USER_LIST_QUERY_ID',
    },
    webhook_secret: {
      doc: 'The Discourse webhook secret.',
      format: '*',
      default: '',
      env: 'DISCOURSE_WEBHOOK_SECRET',
    },
  },
})

// Perform validation
try {
  config.validate({ allowed: 'strict' })
} catch (e) {
  logger.log({
    level: 'error',
    message: e.message,
  })
}

module.exports = config
