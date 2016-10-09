import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'

Vue.use(Electron)
Vue.use(Resource)
Vue.config.debug = true

import App from './App'
import {store} from './api'
/* eslint-disable no-new */
new Vue({
  data () {
    return {
      sharedState: store.state
    }
  },

  created () {
    console.log('test');
    store.fetchList()
  },

  ...App
}).$mount('#app')
