import Vue from 'vue'

var request = require('request')

var config = require('./pocketApiConfig.js')
var customActions = {
  getList: {method: 'POST'}
}

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

	checkForAccessToken: function () {

    if (configStore.get('accessToken') !== null) {
      console.log('check ran');
      this.state.isAuthorized = true
      this.state.loggedIn = true
      this.state.view = 'LandingPage'
    }

	},

	fetchList: function () {

    Pocket.getList({ consumer_key: key, access_token: accessToken, count: "50", detailType: "complete" }).then((response) => {
      this.state.pocketList = response.data.list
    })
  },

  addTags: function () {
    const modify = 'https://getpocket.com/v3/send'

    let actions = [ { action: 'tags_add', tags: 'addedfromPocket', item_id: '1435741427' } ]
    actions = JSON.stringify(actions)

    Vue.http.post(modify, { actions, consumer_key: key, access_token: accessToken }).then((response) => {
      console.log(response)
    }, (response) => {
    // error callback
    })
  },

  runNodeAuth: function () {
    // var getRequestToken = function(key, callback) {
      console.log('runNodeAuth workin');
    	var options = {

    		headers: config.headers,
    		body: "consumer_key="+key+"&redirect_uri="+redirectURL,
    		url: config.pocketUrl.request
    	}

    	request.post(options, function (error, response, body) {
          var body = JSON.parse(body)
          var code = body.code
          console.log(code);

					store.userAuthorizationApproval(code)

    	});
    // }
  },

	userAuthorizationApproval: function (code) {
		// console.log('ran in callback', code);
		localStorage.setItem('requestToken', code);
    configStore.set('requestToken', code);
		var url = 'https://getpocket.com/auth/authorize?request_token='+code+'&redirect_uri='+redirectURL
    this.state.webViewUrl = url
    this.state.showWebView = true
		// window.open(url);

	},

  runGetAccessToken: function () {

    let state = this.state
    if (configStore.get('accessToken') !== null) {
      state.isAuthorized = true
      state.loggedIn = true
      state.view = 'LandingPage'

    } else {
      var requestToken = configStore.get('requestToken')
      var options = {
        headers: config.headers,
        url: config.pocketUrl.authorize,
        body: "consumer_key="+key+"&code="+requestToken
      }

      request.post(options, function (error, response, body) {

  			var body = JSON.parse(body)
        configStore.set('accessToken',  body.access_token)
        state.isAuthorized = true
        state.loggedIn = true
        state.view = 'LandingPage'
      });
    }

  },

	fetchPostsFromUserToken: function() {
		var accessToken = configStore.get('accessToken')

		Pocket.getList({ consumer_key: key, access_token: accessToken, count: "150", detailType: "complete" }).then((response) => {
      this.state.pocketList = response.data.list
    })

    request.post(options, function (error, response, body) {

      var body = JSON.parse(body)
      configStore.set('accessToken',  body.access_token)
      state.isAuthorized = true
      state.loggedIn = true
      state.view = 'LandingPage'
    });
	},

	fetchMyList: function() {
		var accessToken = localStorage.getItem('myAccessToken');
		Pocket.getList({ consumer_key: key, access_token: accessToken, count: "150", detailType: "complete" }).then((response) => {
			this.state.pocketList = response.data.list
		})
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
