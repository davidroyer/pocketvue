import Vue from 'vue'
import VueResource from 'vue-resource'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
Vue.use(VueResource)

var config = require('./pocketApiConfig.js')
var customActions = {
  getList: {method: 'POST'}
}

var PocketAPI = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
		"content-type": "application/json",
		"X-Accept": "application/json"
	}
});

// Vue.axios.get(config.pocketUrl.request).then((response) => {
//   console.log(response.data)
// })
const key = '58661-bde889e092272515b109406c'
const redirectURL = "https://google.com"
// pocketvue://authorizationFinished


const Store = require('../store.js')

const configStore = new Store({
  configName: 'user-settings',
})

export const store = {
  state: {
    pocketList: null,
		users: null,
    authCode: null,
    hasRequestToken: null,
		hasAccessToken: true,
    isAuthorized: false,
		loggedIn: false,
    view: 'Login',
    showWebView: false,
    webViewUrl: null
  },

  switchToMainView: function () {
    this.state.isAuthorized = true
    this.state.loggedIn = true
    this.state.view = 'LandingPage'
  },

	checkForAccessToken: function () {
    if (configStore.get('accessToken') !== null) {
      store.switchToMainView()
    }
	},

  addTags: function () {
    let actions = [ { action: 'tags_add', tags: 'addedfromPocket', item_id: '1435741427' } ]
    actions = JSON.stringify(actions)

    PocketAPI.post('/modify', { actions, consumer_key: key, access_token: accessToken }).then((response) => {
      console.log(response)

    }).catch((response) =>  {
      alert(error);
    });
  },

  runNodeAuth: function () {
      PocketAPI.post('/oauth/request', { consumer_key: key, redirect_uri: redirectURL }

        ).then(function (response) {
            store.userAuthorizationApproval(response.data.code)

        }).catch(function (error) {
            alert(error);
      })
  },

	userAuthorizationApproval: function (code) {
    configStore.set('requestToken', code);
		let url = 'https://getpocket.com/auth/authorize?request_token='+code+'&redirect_uri='+redirectURL

    this.state.webViewUrl = url
    this.state.showWebView = true
		// window.open(url);
	},

  runGetAccessToken: function () {
    let state = this.state
    if (configStore.get('accessToken') !== null) {
      store.switchToMainView()


    } else {
      var requestToken = configStore.get('requestToken')
      var options = {
        headers: config.headers,
        url: config.pocketUrl.authorize,
        body: "consumer_key="+key+"&code="+requestToken
      }

      PocketAPI.post('/oauth/authorize', { consumer_key: key, code: requestToken

        }).then(function (response) {
            configStore.set('accessToken',  response.data.access_token)
            store.switchToMainView()

        }).catch(function (error) {
            alert(error);
      })
    }

  },

	fetchPostsFromUserToken: function() {
		var accessToken = configStore.get('accessToken')
    let currentState = this.state

    PocketAPI.post('/get', { consumer_key: key, access_token: accessToken, count: "300", detailType: "complete" }).then((response) => {
      currentState.pocketList = response.data.list

    }).catch((response) =>  {
      alert(error);
    });

	},


  resetConfig: function () {

    configStore.nullify('accessToken')
    configStore.nullify('requestToken')

    this.state.isAuthorized = false
    this.state.loggedIn = false
  },

  hasRequestToken: function () {
    this.state.hasRequestToken = true
  }
}
