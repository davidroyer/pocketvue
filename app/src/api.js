import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.http.options.emulateJSON = true
Vue.http.options.root = 'https://getpocket.com/v3'

var customActions = {
  getList: {method: 'POST'}
}

const Pocket = Vue.resource('get', {}, customActions);
const articles = Vue.resource('get')
const addArticle = Vue.resource('add')
const Modify = Vue.resource('send')

const key = '58661-bde889e092272515b109406c'
const accessToken = '430fdb01-0bb5-c3de-6e4c-f42005'


export const store = {
  state: {
    pocketList: null
  },

  fetchList: function () {

    Pocket.getList({ consumer_key: key, access_token: accessToken, count: "40", detailType: "complete" }).then((response) => {
      this.state.pocketList = response.data.list
    })
  },
  addTags: function () {
    const modify = 'https://getpocket.com/v3/send'


    let actions = [ { action: 'tags_add', tags: 'addedfromPocket', item_id: '1435741427' } ]
    actions = JSON.stringify(actions)

    // Vue.

    Vue.http.post(modify, { actions, consumer_key: key, access_token: accessToken }).then((response) => {

      console.log(response)

    }, (response) => {
    // error callback
    })
  }
}


/*

https://getpocket.com/v3/get?consumer_key=58661-bde889e092272515b109406c&access_token=430fdb01-0bb5-c3de-6e4c-f42005&count=40&detailType=complete

*/
