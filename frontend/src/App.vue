<template>
  <v-app>
    <v-content>
      <v-container>
        <masonry
          :cols="responsiveColumns(3, 1, 2, 2, 3)"
          :gutter="responsiveGutters('30px', '15px', '15px', '30px', '45px')"
          class="mt-n3"
        >
          <!-- Client List -->
          <AppClientList />
          <!-- Logs -->
          <AppLogs />
          <!-- Assignment Table -->
          <AppAssginmentTable />
        </masonry>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import AppClientList from './components/AppClientList'
import AppLogs from './components/AppLogs'
import AppAssginmentTable from './components/AppAssignmentTable'

export default {
  name: 'App',

  components: {
    AppClientList,
    AppLogs,
    AppAssginmentTable
  },

  data: () => ({
    //
  }),

  methods: {
    responsiveColumns(def, xs, sm, md, lg) {
      const xsString = `"${this.$vuetify.breakpoint.thresholds.xs}":"${xs}"`
      const smString = `"${this.$vuetify.breakpoint.thresholds.sm}":"${sm}"`
      const mdString = `"${this.$vuetify.breakpoint.thresholds.md}":"${md}"`
      const lgString = `"${this.$vuetify.breakpoint.thresholds.lg}":"${lg}"`
      return JSON.parse(
        `{"default":"${def}", ${xsString}, ${smString}, ${mdString}, ${lgString}}`
      )
    },
    responsiveGutters(def, xs, sm, md, lg) {
      const xsString = `"${this.$vuetify.breakpoint.thresholds.xs}":"${xs}"`
      const smString = `"${this.$vuetify.breakpoint.thresholds.sm}":"${sm}"`
      const mdString = `"${this.$vuetify.breakpoint.thresholds.md}":"${md}"`
      const lgString = `"${this.$vuetify.breakpoint.thresholds.lg}":"${lg}"`
      return JSON.parse(
        `{"default":"${def}", ${xsString}, ${smString}, ${mdString}, ${lgString}}`
      )
    }
  }
}
</script>
