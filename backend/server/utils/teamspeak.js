// TeamSpeak
import { TeamSpeak } from 'ts3-nodejs-library'
// DB
import Database from '../utils/database'
// Logger
import logger from './winston'
import teamspeakConfig from './teamspeakConfig'

const database = new Database()

class TeamSpeakServer {
  constructor() {
    if (TeamSpeakServer.instance instanceof TeamSpeakServer) {
      return TeamSpeakServer.instance
    }

    this.ts = TeamSpeak
    this.config = teamspeakConfig
    this.whoami = null
    this.name = teamspeakConfig.nickname
    this.teamspeakReady = false
    this.init()

    // Singleton
    TeamSpeakServer.instance = this
  }

  async init() {
    logger.log({
      level: 'info',
      message: `${this.name} - Connecting to TeamSpeak server...`
    })

    try {
      this.ts = await TeamSpeak.connect(this.config)
    } catch (e) {
      logger.log({
        level: 'error',
        message: e.message
      })
      return
    }

    logger.log({
      level: 'info',
      message: `${this.name} - Successfully connected to TeamSpeak server.`
    })

    this.setState(true)

    this.whoami = await this.ts.whoami()

    await Promise.all([
      this.ts.registerEvent('server'),
      this.ts.registerEvent('channel', 0),
      this.ts.registerEvent('textserver'),
      this.ts.registerEvent('textchannel'),
      this.ts.registerEvent('textprivate')
    ])

    this.ts.on('close', async () => {
      this.setState(false)
      logger.log({
        level: 'error',
        message: `Connection lost. Reconnecting...`
      })
      await this.ts.reconnect(-1, 1000)
      logger.log({
        level: 'info',
        message: `Connection established.`
      })
      this.setState(true)
    })

    // this.ts.on('clientmoved', async (event) => {
    //   await compare.compareChannels()
    // })

    // this.ts.on('clientdisconnect', async () => {
    //   await compare.compareChannels()
    // })
  }

  setState(state) {
    this.teamspeakReady = state
  }

  getState() {
    return this.teamspeakReady
  }

  getWhoami() {
    return this.whoami
  }

  async getChannels() {
    if (this.getState()) {
      let data = null
      try {
        data = await this.ts.channelList()
      } catch (error) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
      return data
    }
  }

  async getSubchannels(cid) {
    if (this.getState()) {
      let data = null
      try {
        data = await this.ts.channelList({ pid: cid })
      } catch (error) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
      return data
    }
  }

  async createChannel(name, properties) {
    if (this.getState()) {
      let data = null
      try {
        data = await this.ts.channelCreate(name, properties)
      } catch (error) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
      return data
    }
  }

  async deleteChannel(cid, force) {
    if (this.getState()) {
      let data = null
      try {
        data = await this.ts.channelDelete(cid, force)
      } catch (error) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
      return data
    }
  }

  async getClientList() {
    if (this.getState()) {
      try {
        const clients = await this.ts.clientList({
          client_type: 0
        })
        return clients
      } catch (e) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
    }
  }

  async addClientUsergroup(client, sgArray) {
    if (this.getState()) {
      try {
        sgArray.forEach(async (sgid) => {
          await this.ts.serverGroupAddClient(client.databaseId, sgid)
        })
        const groupNames = await getGroupNames(sgArray)
        await this.ts.sendTextMessage(
          client.clid,
          1,
          `Usergroup${groupNames.length > 1 ? 's' : ''} ${groupNames.join(
            ', '
          )} added.`
        )
        logger.log({
          level: 'info',
          message: `Add User '${client.nickname}' to Usergroup${
            groupNames.length > 1 ? 's' : ''
          } ${groupNames.join(', ')}`
        })
      } catch (e) {
        console.log(e)
        logger.log({
          level: 'error',
          message: e.message
        })
      }
    }
  }

  async removeClientUsergroup(client, sgArray) {
    try {
      sgArray.forEach(async (sgid) => {
        await this.ts.serverGroupDelClient(client.databaseId, sgid)
      })
      const groupNames = await getGroupNames(sgArray)
      await this.ts.sendTextMessage(
        client.clid,
        1,
        `Usergroup${groupNames.length > 1 ? 's' : ''} ${groupNames.join(
          ', '
        )} removed.`
      )
      logger.log({
        level: 'info',
        message: `Remove User '${client.nickname}' of Usergroup${
          groupNames.length > 1 ? 's' : ''
        } ${groupNames.join(', ')}`
      })
    } catch (e) {
      console.log(e)
      logger.log({
        level: 'error',
        message: e.message
      })
    }
  }

  async serverInfo() {
    if (this.getState()) {
      try {
        const response = await this.ts.serverInfo()
        return response
      } catch (e) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
    }
  }

  async instanceInfo() {
    if (this.getState()) {
      try {
        const response = await this.ts.instanceInfo()
        return response
      } catch (e) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
    }
  }

  async clientList() {
    if (this.getState()) {
      try {
        const response = await this.ts.clientList({ client_type: 0 })
        return response
      } catch (e) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
    }
  }

  async serverGroupList() {
    if (this.getState()) {
      try {
        const response = await this.ts.serverGroupList()
        return response
      } catch (e) {
        logger.log({
          level: 'error',
          message: e.message
        })
      }
    }
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

async function getGroupNames(sgArray) {
  const groupNames = []
  await asyncForEach(sgArray, async (tsId) => {
    const result = await database.readSingleAssignmentByTsId(tsId)
    groupNames.push(result.name)
  })
  return groupNames
}

module.exports = TeamSpeakServer
