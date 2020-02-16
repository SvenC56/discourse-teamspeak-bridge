<template>
  <v-card v-if="loaded" class="mt-3">
    <v-toolbar elevation="0">
      <v-badge>
        <template v-slot:badge>{{ clientList.length }}</template>
        <v-toolbar-title>Clients online</v-toolbar-title>
      </v-badge>
      <v-spacer></v-spacer>
      <v-btn icon @click="getData()">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <span
        v-if="serverinfo.virtualserver_hostbutton_tooltip"
        v-text="`Server: ${serverinfo.virtualserver_hostbutton_tooltip}`"
      ></span>
      <v-img
        v-if="serverinfo.virtualserver_hostbanner_gfx_url"
        :src="serverinfo.virtualserver_hostbanner_gfx_url"
        class="grey lighten-2"
        max-width="500"
        max-height="160"
      ></v-img>
      <v-list three-line>
        <v-list-item v-for="(item, index) in clientList" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ item.client_nickname }}
              <v-chip v-if="item.client_input_muted" x-small class="ml-1">
                <v-avatar left class="mr-0">
                  <v-icon size="12">mdi-microphone-off</v-icon>
                </v-avatar>
                Mute
              </v-chip>
              <v-chip v-if="item.client_output_muted" x-small class="ml-1">
                <v-avatar left class="mr-0">
                  <v-icon size="12">mdi-volume-off</v-icon>
                </v-avatar>
                Deaf
              </v-chip></v-list-item-title
            >
            <v-list-item-subtitle
              style="-webkit-user-select: all; -moz-user-select: all; -ms-user-select: all; user-select: all;"
              v-text="item.client_unique_identifier"
            ></v-list-item-subtitle>
            <span
              ><v-chip
                v-for="servergroup in item.client_servergroups"
                :key="servergroup"
                color="primary"
                small
                class="mr-2 mt-1"
              >
                {{ getServerGroupName(servergroup) }}
              </v-chip></span
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
  <v-card v-else class="mx-auto mt-3 px-5 py-5">
    <v-skeleton-loader type="heading" class="mb-5"></v-skeleton-loader>
    <v-skeleton-loader type="text" class="mt-2 mb-1"></v-skeleton-loader>
    <v-skeleton-loader type="image" class="mt-2 mb-5"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph" class="mb-2"></v-skeleton-loader>
    <v-divider class="my-5" inset></v-divider>
    <v-skeleton-loader type="paragraph" class="mt-2 mb-2"></v-skeleton-loader>
    <v-divider inset></v-divider>
    <v-skeleton-loader type="paragraph" class="mt-2"></v-skeleton-loader>
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
  name: 'AppClientList',

  data: () => ({
    loaded: false,
    teamspeakUserGroups: [],
    clientList: [],
    serverinfo: null
  }),

  async created() {
    this.getData()
  },

  methods: {
    getServerGroupName(id) {
      return this.teamspeakUserGroups.find((x) => x.sgid === id).name
    },
    async getData() {
      this.loaded = false
      await Promise.all([
        this.getTeamSpeakUserGroups(),
        this.getServerinfo(),
        this.getClientList()
      ])
      this.loaded = true
    },
    async getTeamSpeakUserGroups() {
      try {
        const result = await instance.get('/api/teamspeak/servergrouplist')
        this.teamspeakUserGroups = result.data
      } catch (e) {
        throw e
      }
    },
    async getServerinfo() {
      try {
        const result = await instance.get('/api/teamspeak/serverinfo')
        this.serverinfo = result.data
      } catch (e) {
        throw e
      }
    },
    async getClientList() {
      try {
        const result = await instance.get('/api/teamspeak/clientlist')
        this.clientList = result.data
      } catch (e) {
        throw e
      }
    }
  }
}
</script>
