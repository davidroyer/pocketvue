import Vue from 'vue'
import axios from 'axios'
const pocketConfig = require('./config/AppSettings')

const UserStore = require('../UserStore.js')
const key = pocketConfig.key
console.log(key);
const redirectURL = pocketConfig.redirectURL
import _ from 'lodash'

const userStore = new UserStore({
  configName: 'user-settings',
  defaults: {
    requestToken: null,
    accessToken: null,
    loggedIn: false
  }
})

var PocketAPI = axios.create({
  baseURL: 'https://getpocket.com/v3',
  headers: {
		"content-type": "application/json",
		"X-Accept": "application/json"
	}
});

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
    webViewUrl: null,
    fullList: null
  },

  switchToMainView: function () {
    this.state.isAuthorized = true
    this.state.loggedIn = true
    this.state.view = 'LandingPage'
  },

	checkForAccessToken: function () {
    if (userStore.get('accessToken') !== null) {
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

  addArticle: function (url) {

    PocketAPI.post('/add', { url: url, consumer_key: key, access_token: userStore.get('accessToken') })
    .then((response) => {
      alert('Your article has been saved!')
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
    userStore.set('requestToken', code);
    this.state.webViewUrl = 'https://getpocket.com/auth/authorize?request_token='+code+'&redirect_uri='+redirectURL
    this.state.showWebView = true
	},

  runGetAccessToken: function () {
    let state = this.state
    if (userStore.get('accessToken') !== null) {
      store.switchToMainView()

    } else {
      var requestToken = userStore.get('requestToken')

      PocketAPI.post('/oauth/authorize', { consumer_key: key, code: requestToken

        }).then(function (response) {
            userStore.set('accessToken',  response.data.access_token)
            store.switchToMainView()

        }).catch(function (error) {
            alert(error);
      })
    }

  },

	fetchPostsFromUserToken: function() {
		var accessToken = userStore.get('accessToken')
    let currentState = this.state

    PocketAPI.post('/get', { consumer_key: key, access_token: accessToken, count: "300", detailType: "complete" }).then((response) => {
      currentState.pocketList = response.data.list

    }).catch((response) =>  {
      alert(error);
    });

	},

  fetchFullList: function () {
    var accessToken = userStore.get('accessToken')
    let currentState = this.state

    PocketAPI.post('/get', { consumer_key: key, access_token: accessToken, detailType: "complete" })

    .then((response) => {
      currentState.fullList = response.data.list
    })

    .catch((response) =>  {
      alert(error);
    });
  },

  resetConfig: function () {
    userStore.nullify('accessToken')
    userStore.nullify('requestToken')
    this.state.isAuthorized = false
    this.state.loggedIn = false
  },

  hasRequestToken: function () {
    this.state.hasRequestToken = true
    this.state.isAuthorized = true

  }
}
