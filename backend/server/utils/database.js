const fs = require('fs-extra')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const appRoot = require('app-root-path')
const shortid = require('shortid')

const dbDir = `${appRoot}\\db\\database.json`
fs.ensureFileSync(dbDir)
const adapter = new FileSync(`${appRoot}/db/database.json`)

class Database {
  constructor() {
    if (Database.instance instanceof Database) {
      return Database.instance
    }

    this.db = low(adapter)
    this.init()

    Database.instance = this
  }

  init() {
    this.db.defaults({ assignments: [] }).write()
  }

  createAssignment(data) {
    data.id = shortid.generate()
    return this.db.get('assignments').push(data).write()
  }

  readAllAssignments() {
    const data = this.db.get('assignments').value()
    return data
  }

  readSingleAssignment(id) {
    const data = this.db.get('assignments').find({ id }).value()
    return data
  }

  readSingleAssignmentByTsId(tsid) {
    const data = this.db.get('assignments').find({ tsid }).value()
    return data
  }

  updateAssignment(data) {
    return this.db.get('assignments').find({ id: data.id }).assign(data).write()
  }

  deleteAssignment(id) {
    return this.db.get('assignments').remove({ id }).write()
  }
}

module.exports = Database
