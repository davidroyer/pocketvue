import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import _ from 'lodash'

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
    store.fetchList()
  },

  computed: {
    tags: function () {

      var list =  this.sharedState.pocketList

      var finalResult = _
        .chain(list)
        .values(list)
        .filter('tags');

        finalResult = finalResult.map(function(obj){
          //  return obj.tags
          //  for (var tag in obj.tags) {
          //    if (obj.tags.hasOwnProperty(tag)) {
          //      return tag
          //    }
          //  }
          _.forIn(obj.tags, function(value, key) {
            return _.values(key)
          })
        })
    },
    lodashTags: function () {

      var list =  this.sharedState.pocketList

      var filteredResult = _
        .chain(list)
        .filter('tags');
        // .map(function(tagObj) {
        //   .keys_(tagObj)
        // });
        // finalResult = finalResult.map(function(obj){
        //   //  return obj.tags
        //    for (var tag in obj.tags) {
        //      if (obj.tags.hasOwnProperty(tag)) {
        //        return tag
        //      }
        //    }
        // })

        function getTagsfromArticles(article) {
          return article
          // _.forIn(article.tags, function(value, key) {
          //   return key
          // })
        }

        var mappedResult = _.map(filteredResult, 'tags')
        // var mappedResult = _.map(filteredResult, function(article) {
        //   return article['resolved_title']
        // })
        return filteredResult
    //   var pocketList =  this.sharedState.pocketList
    //   var result = _.map(pocketList, function(articleItem) {
    //             return articleItem['tags']
    //           //  return _.keys(articleItem.tags)
    //       // return _.includes(post.categories, pickedCategory);
    //   })
    // return result
    }
  },

  mounted () {
  },

  ...App
}).$mount('#app')
