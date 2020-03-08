import cron from 'node-cron'
import { compareGroups } from './compareGroups'
import config from './config'
import logger from './winston'

// Cronjob
cron.schedule(config.get('cronInterval'), async () => {
  try {
    await compareGroups()
  } catch (e) {
    logger.log({
      level: 'error',
      message: e.message
    })
  }
})

module.exports = cron
