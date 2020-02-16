<template>
  <v-card v-if="loaded" class="mt-3">
    <v-toolbar elevation="0">
      <v-toolbar-title>Logs</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="getLogs()">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-alert v-for="(item, index) in logs" :key="index" :type="item.level">
        <v-chip color="white" small outlined>
          {{ $moment(item.timestamp).fromNow() }}
        </v-chip>
        {{ item.message }}
      </v-alert>
    </v-card-text>
  </v-card>
  <v-card v-else class="mx-auto mt-3 px-5 py-5">
    <v-skeleton-loader type="heading" class="mb-5"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph" class="mx-2 mb-3"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph" class="mx-3"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph" class="mt-3 mb-2"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph" class="mt-3 mb-2"></v-skeleton-loader>
    <v-skeleton-loader type="paragraph" class="mt-3 mb-2"></v-skeleton-loader>
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
  name: 'AppLogs',

  data: () => ({
    logs: [],
    loaded: false
  }),

  async created() {
    await this.getLogs()
  },

  methods: {
    async getLogs() {
      try {
        this.loaded = false
        const result = await instance.get('/api/logs')
        this.logs = result.data.file
        this.loaded = true
      } catch (e) {
        throw e
      }
    }
  }
}
</script>
