import config from './config'

const discourseConfig = {
  host: config.get('discourse.host'),
  apikey: config.get('discourse.apikey'),
  user: config.get('discourse.user'),
  custom_field_name: config.get('discourse.custom_field_name'),
  query_id: config.get('discourse.query_id'),
  webhook_secret: config.get('discourse.webhook_secret'),
}

module.exports = discourseConfig
