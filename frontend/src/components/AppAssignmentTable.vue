<template>
  <v-card v-if="loaded" class="mt-3">
    <v-data-table
      :headers="headers"
      :items="assignments"
      sort-by="name"
      class="elevation-0"
    >
      <template v-slot:item.protectedgroup="{ item }">
        <v-icon v-if="item.protectedgroup === 1" color="success"
          >mdi-check</v-icon
        >
        <v-icon v-else color="error">mdi-close</v-icon>
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Assignments</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Edit</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <span>Discourse Group</span>
                      <v-select
                        v-model.number="editedItem.dcid"
                        :items="discourseUserGroups"
                        item-text="name"
                        item-value="id"
                        single-line
                        class="mt-0 pt-0"
                      ></v-select>
                    </v-flex>
                    <v-flex align-center justify-center row class="mb-3">
                      <v-icon>mdi-arrow-down-bold-circle</v-icon>
                    </v-flex>
                    <v-flex xs12>
                      <span>TeamSpeak Servergroup</span>
                      <v-select
                        v-model.number="editedItem.tsid"
                        type="number"
                        :items="teamspeakUserGroups"
                        item-text="name"
                        item-value="sgid"
                        single-line
                        class="mt-0 pt-0"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12>
                      <span></span>
                      <v-checkbox
                        v-model.number="editedItem.protectedgroup"
                        :true-value="1"
                        :false-value="0"
                        label="Protected Usergroup?"
                      ></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-card>
  <v-card v-else class="mx-auto mt-3 px-5 py-5">
    <v-skeleton-loader type="table"></v-skeleton-loader>
  </v-card>
</template>

<script>
import axios from 'axios'
const dev = process.env.NODE_ENV !== 'production'
let baseURL = null
if (dev) {
  baseURL = 'http://localhost:8081'
} else {
  baseURL = process.env.BASE_URL
}
const instance = axios.create({
  baseURL
})

export default {
  name: 'AppAssignmentTable',

  data: () => ({
    loaded: false,
    error: null,
    assignments: [],
    teamspeakUserGroups: [],
    discourseUserGroups: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {
      id: '',
      name: '',
      tsid: 0,
      dcid: 0,
      rowid: 0,
      protectedgroup: 0
    },
    defaultItem: {
      name: '',
      tsid: 0,
      dcid: 0,
      rowid: 0,
      protectedgroup: 0
    },
    headers: [
      { text: 'Servergroup Name', value: 'name' },
      { text: 'TeamSpeak ID', value: 'tsid', sortable: false },
      { text: 'Discourse ID', value: 'dcid', sortable: false },
      { text: 'Protected', value: 'protectedgroup', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    return this.getData()
  },

  methods: {
    getServerGroupName(id) {
      return this.teamspeakUserGroups.find((x) => x.sgid === id).name
    },
    async getData() {
      this.loaded = false
      await Promise.all([
        this.getTeamSpeakUserGroups(),
        this.getDiscourseUsergroups(),
        this.getAssignments()
      ])
      this.loaded = true
    },
    async getTeamSpeakUserGroups() {
      try {
        const response = await instance.get('/api/teamspeak/servergrouplist')
        this.teamspeakUserGroups = response.data
        return
      } catch (e) {
        this.error = e.response
        return
      }
    },
    async getDiscourseUsergroups() {
      try {
        const response = await instance.get('/api/discourse/groups')
        this.discourseUserGroups = response.data
        return
      } catch (e) {
        this.error = e.response
        return
      }
    },
    async getAssignments() {
      try {
        const response = await instance.get('/api/assignments')
        this.assignments = response.data
        return
      } catch (e) {
        this.error = e.response
        return
      }
    },

    editItem(item) {
      this.error = null
      this.editedIndex = this.assignments.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    async deleteItem(item) {
      const index = this.assignments.indexOf(item)
      const id = this.assignments[index].id
      const isConfirmed = confirm('Are you sure you want to delete this item?')
      if (isConfirmed) {
        try {
          await instance.delete('/api/assignments', {
            data: { id }
          })
        } catch (e) {
          this.error = e.response
          return
        }
        this.assignments.splice(index, 1)
      }
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    async save() {
      let response = null
      this.editedItem.name = this.getServerGroupName(this.editedItem.tsid)
      if (this.editedIndex > -1) {
        // Update item
        try {
          response = await instance.patch('/api/assignments', this.editedItem)
          Object.assign(this.assignments[this.editedIndex], response.data)
        } catch (e) {
          this.error = e.response
          return
        }
      } else {
        // Create new item
        try {
          delete this.editedItem.id
          response = await instance.post('/api/assignments', this.editedItem)
          this.assignments.push(response.data[response.data.length - 1])
        } catch (e) {
          this.error = e.response
          return
        }
      }
      this.close()
    }
  }
}
</script>
