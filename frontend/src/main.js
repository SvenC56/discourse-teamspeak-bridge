import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import vueMasonryCss from './plugins/vue-masonry-css'
import vueMoment from './plugins/vue-moment'

Vue.config.productionTip = false

new Vue({
  vuetify,
  vueMasonryCss,
  vueMoment,
  render: (h) => h(App),
}).$mount('#app')
