import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
var request = require('request')
Vue.http.headers.common['Content-Type'] = 'application/json'
Vue.http.options.emulateJSON = true
Vue.http.options.root = 'https://getpocket.com/v3'
var config = require('./pocketApiConfig.js')
var customActions = {
  getList: {method: 'POST'}
}

const Pocket = Vue.resource('get', {}, customActions);
const articles = Vue.resource('get')
const addArticle = Vue.resource('add')
const Modify = Vue.resource('send')

const key = '58661-bde889e092272515b109406c'
const redirectURL = "http://google.com"


export const store = {
  state: {
    pocketList: null,
		users: null,
    authCode: null,
		hasAccessToken: true,
    isAuthorized: false,
		loggedIn: false,
    view: 'Login'
  },

  setLocalStorageConfig: function () {
    if (localStorage.userIsAuthorized === undefined) {
      localStorage.setItem('userIsAuthorized', false)
    }
  },

	getUsers: function () {
		this.state.users = JSON.parse(localStorage.getItem('users'))
	},

	checkForAccessToken: () => {
			var result = localStorage.accessToken !== undefined ? 'We have token' : 'We have undefined'
			console.log(result);
		if (localStorage.accessToken !== undefined) {

		} else {

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

		var url = 'https://getpocket.com/auth/authorize?request_token='+code+'&redirect_uri='+redirectURL
		window.open(url);

	},

  runGetAccessToken: function () {
    
    let state = this.state
    if (localStorage.currentUserAccessToken !== undefined) {
      state.loggedIn = true
      state.view = 'LandingPage'

    } else {
      var requestToken = localStorage.getItem('requestToken')
      var options = {
        headers: config.headers,
        url: config.pocketUrl.authorize,
        body: "consumer_key="+key+"&code="+requestToken
      }

      request.post(options, function (error, response, body) {

  			var body = JSON.parse(body)
  			var usersArray =  JSON.parse(localStorage.getItem('users'))
  			var user = {username: body.username, access_token: body.access_token}
  			usersArray.push(user)
        console.log(body.access_token);

  			localStorage.setItem( 'currentUserAccessToken', body.access_token)
        state.loggedIn = true
        state.view = 'LandingPage'
      });
    }

  },

	fetchPostsFromUserToken: function() {
		var accessToken = localStorage.getItem('currentUserAccessToken');

		Pocket.getList({ consumer_key: key, access_token: accessToken, count: "150", detailType: "complete" }).then((response) => {
      this.state.pocketList = response.data.list
    })
	},

	fetchMyList: function() {
		var accessToken = localStorage.getItem('myAccessToken');
		Pocket.getList({ consumer_key: key, access_token: accessToken, count: "150", detailType: "complete" }).then((response) => {
			this.state.pocketList = response.data.list
		})
	}
}
