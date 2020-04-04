import { stringify } from 'qs'
import axios from 'axios'
import discourseConfig from './discourseConfig'
import logger from './winston'

class DiscourseServer {
  constructor() {
    if (DiscourseServer.instance instanceof DiscourseServer) {
      return DiscourseServer.instance
    }

    this.config = discourseConfig
    this.axiosInstance = axios.create({
      baseURL: discourseConfig.host,
    })
    this.discourseReady = false
    this.groups = []
    this.users = []
    this.init()

    // Singleton
    DiscourseServer.instance = this
  }

  async init() {
    logger.log({
      level: 'info',
      message: `Connecting to Discourse server...`,
    })

    try {
      const response = await this.axiosInstance.get('/srv/status')
      if (response.data !== 'ok') {
        throw new Error('Discourse not ok')
      }
    } catch (e) {
      logger.log({
        level: 'error',
        message: e.message,
      })
      return
    }

    logger.log({
      level: 'info',
      message: `Successfully connected to Discourse server.`,
    })

    this.setState(true)
  }

  setState(state) {
    this.discourseReady = state
  }

  getState() {
    return this.discourseReady
  }

  async getGroups() {
    if (this.getState()) {
      try {
        const response = await this.axiosInstance.get('/groups.json')
        this.groups = response.data.groups
        return this.groups
      } catch (e) {
        logger.log({
          level: 'error',
          message: e.message,
        })
      }
    }
  }

  async getUsers() {
    if (this.getState()) {
      const requestBody = stringify({
        params: `{ "custom_field_name" : "${this.config.custom_field_name}" }`,
      })
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'Api-Key': this.config.apikey,
          'Api-Username': this.config.user,
        },
      }
      try {
        const response = await this.axiosInstance.post(
          `/admin/plugins/explorer/queries/${this.config.query_id}/run`,
          requestBody,
          config
        )

        this.users = response.data.rows.map((user) => ({
          user_id: user[0],
          name: user[1],
          user_group: user[2],
          teamspeak_uid: user[3],
        }))
        return this.users
      } catch (e) {
        logger.log({
          level: 'error',
          message: e.message,
        })
      }
    }
  }
}

module.exports = DiscourseServer
