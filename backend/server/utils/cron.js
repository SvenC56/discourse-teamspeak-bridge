import cron from 'node-cron'
import { compareGroups } from './compareGroups'
import logger from './winston'

// Cronjob
cron.schedule('*/2 * * * *', async () => {
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
