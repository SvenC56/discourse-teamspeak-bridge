import express from 'express'
import Database from '../utils/database'
import logger from '../utils/winston'
import { pick } from 'lodash'
import TeamSpeakServer from '../utils/teamspeak'
import { compareGroups } from '../utils/compareGroups'
import DiscourseServer from '../utils/discourse'

const router = express.Router()
const teamspeakServer = new TeamSpeakServer()
const discourseServer = new DiscourseServer()
const database = new Database()

router.get('/healthcheck', async (req, res, next) => {
  try {
    const response = {
      server: 'up',
      teamspeak: teamspeakServer.getState(),
      discourse: discourseServer.getState(),
    }
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/trigger', async (req, res, next) => {
  try {
    await compareGroups()
    await res.status(200).json({
      message: 'Completed!',
    })
  } catch (e) {
    console.log(e)
    next(e)
  }
})

router.get('/assignments', async (req, res, next) => {
  try {
    const response = await database.readAllAssignments()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post('/assignments', async (req, res, next) => {
  try {
    const data = pick(req.body, ['name', 'dcid', 'tsid', 'protectedgroup'])
    const response = await database.createAssignment(data)
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.delete('/assignments', async (req, res, next) => {
  try {
    const response = await database.deleteAssignment(req.body.id)
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.patch('/assignments', async (req, res, next) => {
  try {
    const data = pick(req.body, [
      'id',
      'name',
      'dcid',
      'tsid',
      'protectedgroup',
    ])
    const response = await database.updateAssignment(data)
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post('/webhook', async (req, res, next) => {
  try {
    await compareGroups()
    await res.status(200).json({
      message: 'Completed!',
    })
  } catch (e) {
    next(e)
  }
})

router.get('/logs', async (req, res, next) => {
  try {
    const options = {
      from: req.query.from
        ? req.query.from
        : new Date() - 7 * 24 * 60 * 60 * 1000,
      until: req.query.until ? req.query.until : 0,
      limit: req.query.limit ? req.query.limit : 25,
      start: req.query.start ? req.query.start : 0,
      order: req.query.order ? req.query.order : 'desc',
      fields: req.query.fields ? req.query.fields : undefined,
    }
    await logger.query(options, async (err, results) => {
      if (err) {
        throw err
      }
      await res.status(200).json(results)
    })
  } catch (e) {
    next(e)
  }
})

router.get('/teamspeak/serverinfo', async (req, res, next) => {
  try {
    const response = await teamspeakServer.serverInfo()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/teamspeak/instanceinfo', async (req, res, next) => {
  try {
    const response = await teamspeakServer.instanceInfo()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/teamspeak/clientlist', async (req, res, next) => {
  try {
    const response = await teamspeakServer.clientList()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/teamspeak/servergrouplist', async (req, res, next) => {
  try {
    const response = await teamspeakServer.serverGroupList()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/discourse/groups', async (req, res, next) => {
  try {
    const response = await discourseServer.getGroups()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get('/discourse/users', async (req, res, next) => {
  try {
    const response = await discourseServer.getUsers()
    await res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

module.exports = router
