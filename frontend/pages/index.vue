<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-data-table
        :headers="headers"
        :items="assignments"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Assignments</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  >New Item</v-btn
                >
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Dessert name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.calories"
                          label="Calories"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.fat"
                          label="Fat (g)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.carbs"
                          label="Carbs (g)"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.protein"
                          label="Protein (g)"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.shield`]="{ item }">
          <v-icon v-if="item.shield" small>mdi-check-circle-outline</v-icon>
          <v-icon v-else small> mdi-checkbox-blank-circle-outline </v-icon>
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          <span>
            {{ $moment(item.createdAt).startOf('minute').fromNow() }}</span
          >
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          <span>
            {{ $moment(item.updatedAt).startOf('minute').fromNow() }}</span
          >
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Protected', value: 'shield', sortable: false },
        { text: 'Discourse ID', value: 'dcid', sortable: false },
        { text: 'TeamSpeak ID', value: 'tsid', sortable: false },
        { text: 'Created At', value: 'createdAt', sortable: false },
        { text: 'Updated At', value: 'updatedAt', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      discourseGroups: [],
      teamspeakGroups: [],
      assignments: [],
      loaded: false,
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  async mounted({ $axios }) {
    this.loaded = false
    this.discourseGroups = await $axios.$get('/api/discourse/groups')
    this.teamspeakGroups = await $axios.$get('/api/teamspeak/servergrouplist')
    this.assignments = await $axios.$get('/api/assignment')
    this.loaded = true
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.assignments.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.assignments.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.assignments.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.assignments[this.editedIndex], this.editedItem)
      } else {
        this.assignments.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
