import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import _ from 'lodash'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
require('../node_modules/material-design-icons/iconfont/material-icons.css')
var bus = new Vue()


console.log(bus);
Vue.use(VueMaterial)
Vue.material.theme.register('default', {
  primary: 'indigo',
  accent: 'pink'
})


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

    store.checkForAccessToken()

  },

  mounted () {
    store.setLocalStorageConfig()
  },

  ...App
}).$mount('#app')
