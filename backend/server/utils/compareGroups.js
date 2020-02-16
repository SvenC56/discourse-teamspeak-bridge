// Lodash
import { difference, intersectionWith, isEqual, isEmpty } from 'lodash'
// DB
import Database from './database'
// TeamSpeak
import TeamSpeakServer from './teamspeak'
// Discourse
import DiscourseServer from './discourse'
// Logger
import logger from './winston'

const database = new Database()
const teamspeakServer = new TeamSpeakServer()
const discourseServer = new DiscourseServer()

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

exports.compareGroups = async function() {
  let teamSpeakUsers = []
  let discourseUsers = []

  try {
    teamSpeakUsers = await teamspeakServer.getClientList()
    discourseUsers = await discourseServer.getUsers()
  } catch (e) {
    logger.log({
      level: 'error',
      message: e.message
    })
  }

  // Check every Client online on TeamSpeak3 Server
  await asyncForEach(teamSpeakUsers, async (client) => {
    const result = await compareUsergroups(client, discourseUsers)

    // User is not synchronised
    if (!result) {
      return
    }

    if (!isEmpty(result.toAdd)) {
      await teamspeakServer.addClientUsergroup(client, result.toAdd)
    }

    if (!isEmpty(result.toDelete)) {
      await teamspeakServer.removeClientUsergroup(client, result.toDelete)
    }
  })
}

async function compareUsergroups(client, discourseUserList) {
  // Checks if User is synchronised with Discourse
  // eslint-disable-next-line prefer-const
  let discourseUser = discourseUserList.find(
    (element) => element.teamspeak_uid === client.uniqueIdentifier
  )

  let discourseUserGroups = []

  if (discourseUser) {
    discourseUserGroups = discourseUserList.filter(
      (element) => element.user_id === discourseUser.user_id
    )

    discourseUser.usergroups = discourseUserGroups.map(
      (element) => element.user_group
    )
  } else {
    // Create Fake User Object for non synchronised Members
    discourseUser = { usergroups: [] }
  }

  // eslint-disable-next-line prefer-const
  let isIn = []
  // eslint-disable-next-line prefer-const
  let isNotIn = []

  const assignTable = database.readAllAssignments()

  assignTable.forEach((element) => {
    if (discourseUser.usergroups.includes(element.dcid)) {
      return isIn.push(element.tsid)
    }
    if (element.protectedgroup === 1) {
      return isNotIn.push(element.tsid)
    }
  })

  let toAdd = difference(isIn, client.servergroups)

  let toDelete = intersectionWith(isNotIn, client.servergroups, isEqual)

  return {
    toAdd,
    toDelete
  }
}
