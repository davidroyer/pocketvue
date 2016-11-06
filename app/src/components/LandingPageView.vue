<template>
  <div class="landing-page">

    <div class="tag-list">
      <div class="tag-list_wrapper">
        <label>All My Items
          <input type="radio" name="filterValue" value="all" v-model="valueToFilterBy">
        </label>
      </div>
      <div class="tag-list_wrapper" v-for="tag in uniqueTagList">
        <label>{{tag}}
          <input type="radio" name="filterValue" :value="tag" v-model="valueToFilterBy">
        </label>
      </div>
    </div>

    <ul class="list">
      <pocket-item v-for="item in testFilterByTag"
        v-on:articleUrlSelected="testRemoteWindow"
        :item="item">
      </pocket-item>
    </ul>

    <div class="article__wrapper " v-show="showArticle">

      <!-- <md-button type="button" class="md-primary md-raised" name="button" @click="toggleArticleViewer">Close Article</md-button> -->
      <md-button class="md-icon-button close-article md-raised md-accent" @click="toggleArticleViewer">
        <md-icon>arrow_back</md-icon>
      </md-button>
      <!-- <div v-html="currentArticle.content"></div> -->
      <webview id="articleFrame" src="https://www.github.com/" style="display:inline-flex; width:inherit; height:inherit" ></webview>

    </div>
  </div>
</template>

<script>
  const {BrowserWindow, screen} = require('electron').remote
  const {webContents} = require('electron').remote
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import {store} from '../api'
  import PocketItem from './LandingPageView/PocketItem'
  var extractor = require('article-extractor');
  require('../../node_modules/wysiwyg.css/wysiwyg.css')
  var request = require('request')

  import _ from 'lodash'
  const electron = require('electron')
  let displays = screen.getAllDisplays()
  console.log(displays);
  // var winOptions = { width: 600,
  //                  height: 800,
  //                  show: false,
  //                  x: 1440 - 600,
  //                  y: 0,
  //                  webPreferences: {
  //                      nodeIntegration: false,
  //                      webSecurity: false
  //                  }
  //              };
  // const remoteViewer = new BrowserWindow(winOptions)
  // testWindow = new BrowserWindow(winOptions);
  export default {
    components: {
      Links,
      Versions,
      PocketItem
    },

    data () {
      return {
        sharedState: store.state,
        showArticle: false,
        currentArticle: null,
        valueToFilterBy: 'all',
        testWindow: null,
        win: null
      }
    },

    created () {
      this.getList()
    },

    mounted () {
      this.prepareRemoteWindow()
    },

    computed: {
      uniqueTagList: function () {
        var vm = this
        let filteredList =  _.filter(vm.sharedState.pocketList, 'tags')

        filteredList =  _.mapValues(filteredList, 'tags')

        filteredList = _.map(filteredList, function(obj) {
          return _.keysIn(obj)
        })

        return _.uniq(_.flatten(filteredList))
      },

      tags: function () {

        var list =  this.sharedState.pocketList
            // console.log(users);
            let tagObjects =  _.filter(list, 'tags')
            tagObjects = _.mapValues(tagObjects, 'tags');


            // return tagObjects
            // return _.keysIn(tagObjects)
            var arrayOfObjectsWithDuplicateTags =  _.valuesIn(tagObjects)

            var uniqueItems = _.uniq(arrayOfObjectsWithDuplicateTags, function(o){ return o.tags.tag; });
            console.log(uniqueItems);
            return uniqueItems
            // return _.flatten(tagObjects)
        // return _.findKey(list, ['has_video', '0']);
      },

      newestTest: function () {
        var pocketList =  this.sharedState.pocketList
        var arrayOfObjectsWithDuplicateTags =  _.filter(pocketList, function(item) {
          // return _.includes(item.tags, 'vue');
          return _.get(item, 'tags');

        })


        var uniqueItems = _.uniq(arrayOfObjectsWithDuplicateTags, function(o){ return o.tags; });
        console.log(uniqueItems);
        return uniqueItems
      },

      testFilterByTag: function () {

        var pocketList = this.sharedState.pocketList
        var filterByThis = this.valueToFilterBy

        if (filterByThis !== 'all') {
          var filterItem = 'tags.' + filterByThis
          return _.filter(pocketList, function(item) {
            // return _.includes(item.tags, 'vue');
            return _.has(item, filterItem);

          })
        } else {
          return pocketList
        }
        // return  _.forEach(itemsWithTags, function(value, key) {
        //     _.forEach(value.tags, function(value, key) {
        //       return key.item_id
        //     })
        //
        // })
        //
        // return _.filter(itemsWithTags, function(item) {
        //     return _.hasIn(itemsWithTags, 'item.tags.tag1')
        //
        // })
      },

      testFilterByMultipleTags: function (tagToFilterBy) {

        var pocketList = this.sharedState.pocketList
        var filterByThese = ['tags.vue', 'tags.electron']

      var arrayofArrays =  _.map(filterByThese, function(tag) {
        return _.filter(pocketList, function(item) {
          return _.has(item, tag)
        })
      })

      return _.reduce(arrayofArrays, function(flattened, other) {
        return _.uniq(flattened.concat(other));
      }, []);

        // return _.filter(pocketList, function(item) {
        //   return _.has(item,'tags.vue') && _.has(item,'tags.electron') ;
        //
        // })

        let result1 =
        _.filter(pocketList, function(item) {
          return _.has(item, filterByThese[0]);
          // return _.has(item, 'tags.vue');
          // return _.has(item, ['tags.vue']);
        })

        result1 +=
        _.filter(pocketList, function(item) {
          return _.has(item, filterByThese[1]);
          // return _.has(item, 'tags.vue');
          // return _.has(item, ['tags.vue']);
        })


        // return result1
        console.log(result1);
      // return _.union(result1, result2)



        // return _.forEach(filterByThese, function(value) {
        //   return value
        // });
        //

      }
    },

    methods: {
      goToUrl: () => {
      },

      prepareRemoteWindow: function () {
        const BrowserWindow = this.$electron.remote.BrowserWindow
        var winOptions = { width: 600,
                         height: 800,
                         show: false,
                         x: 1440 - 600,
                         y: 0,
                         webPreferences: {
                             nodeIntegration: false,
                             webSecurity: false
                         }
                     };
        this.win = new BrowserWindow(winOptions)
      },

      testRemoteWindow: function (url) {

        this.win.loadURL(url);
        this.win.show();

      },

      getFocusedWebContents: function () {
        let contents = webContents.getBrowserWindowOptions()
        console.log(contents.getURL())
      },

      getCurrentWebContents: function () {
        let webContents = this.$electron.remote.getCurrentWebContents();
        console.log(webContents);
        let allWindows = BrowserWindow.getAllWindows()
        console.log('Windows: ', allWindows);
      },

      toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle();
      },

      filterPocketList: function (tagToFilterBy) {
        var pocketList = this.sharedState.pocketList

        var filterItem = 'tags.' + tagToFilterBy
        var result = _.filter(pocketList, function(item) {
          // return _.includes(item.tags, 'vue');
          return _.has(item, filterItem);

        })
      },

      getArticleContent: function (url) {
        let $vm = this
        this.showArticle = true
        extractor.extractData(url, function (err, data) {
          // console.log(data.content);
          $vm.currentArticle = data
        });
      },

      getRequestToken: function () {
        store.runNodeAuth()
      },

      getAccessToken: function () {
        store.runGetAccessToken()
      },

      getList: function () {
        store.fetchPostsFromUserToken()
      },

      getMyList: function () {
        store.fetchMyList()
      },

      showWebArticle: function (url) {
        console.log('show is running')
        console.log(url);
        const webview = document.getElementById('articleFrame')
        // console.log(url);
        webview.src = url
        this.showArticle = true
        webview.reload()
      },

      toggleArticleViewer: function () {
        this.showArticle = !this.showArticle
      }
    },

    name: 'landing-page'
  }
</script>

<style lang="scss" scoped>
  .list {
    display: inline-flex;
    // width: 70%;
    left: 250px;
    flex-direction: row;
    flex-wrap: wrap;
    list-style-type: none;
    justify-content: space-around;
    position: fixed;
    right: 0;
    height: 100%;
    overflow-y: auto;
    top: 64px;
    padding-bottom: 6.5em;
    background: #4a4a4a;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #404040;
    }

    &::-webkit-scrollbar-track {
      background: #ddd;
    }

    &::-webkit-scrollbar-button {
      background: #404040;
      height: 50px;
      border-radius: 50%;
    }

  }

  .article {
    &__wrapper {
      position: fixed;
      top: 65px;
      top: 50px;
      right: 0;
      width: 40%;
      bottom: 0;
      background-color: #fdfdfd;
      height: 100%;
      overflow-y: auto;
      padding: 1em .5em;
      left: 0;
      right: 0;
      width: 100vw;
    }
  }

  .tag-list {
    display: inline-flex;
    top: -33px;
    flex-direction: column;
    position: fixed;
    width: 250px;
    left: 0;
    overflow-y: auto;
    top: 0;
    height: 100%;
    padding: 6em 1em 2em 1em;

    & label {
      color: #1c1b1b;
      font-weight: 500;
      font-size: 15px;
      font-family: "Roboto";
      letter-spacing: .5px;
      line-height: 1.7;
      text-transform: capitalize;
      margin-bottom: -1em;
      cursor: pointer;

      & input {
        cursor: pointer;
      }
    }

    &_wrapper {
      margin: 5px 0;


    }
  }

  .close-article {
    margin-bottom: 1em;
    position: fixed;
    top: 75px;
  }


</style>
