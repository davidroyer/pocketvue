<template>
  <div class="landing-page">

    <div class="tag-list">

      <div class="tag-list_wrapper">
        <md-button class="md-icon-button add-article md-raised md-accent" @click="addArticle">
          <md-icon>add</md-icon>
        </md-button>
        <label>All My Items
          <input type="radio" name="filterValue" value="all" v-model="valueToFilterBy">
        </label>
      </div>
      <div class="tag-list_wrapper" v-for="tag in uniqueTagList">
        <label>{{tag.tag}}
          <input type="radio" :id="tag.item_id" name="filterValue" :value="tag.tag" v-model="valueToFilterBy">
        </label>
      </div>
    </div>

    <transition-group name="list-complete" tag="ul">
      <pocket-item v-for="item in filterByTag"
        @articleUrlSelected="launchArticleView"
        :item="item"
        :key="item.item_id">
      </pocket-item>
    </transition-group>

    <!-- <div class="article__wrapper " v-show="showArticle">
      <md-button class="md-icon-button close-article md-raised md-accent" @click="toggleArticleViewer">
        <md-icon>arrow_back</md-icon>
      </md-button>
      <webview id="articleFrame" src="https://getpocket.com/a/queue/" style="display:inline-flex; width:inherit; height:inherit" ></webview>
    </div> -->

  </div>
</template>

<script>
  const {BrowserWindow, screen, webContents, dialog} = require('electron').remote
  const ipcRenderer = require('electron')
  const path = require('path')
  import {store} from '../SharedStore'
  import PocketItem from './LandingPageView/PocketItem'
  import MultiTest from './MultiTest'
  var request = require('request')

  import _ from 'lodash'
  const electron = require('electron')
  import bus from '../bus'


  export default {
    components: {
      PocketItem,
      MultiTest
    },

    data () {
      return {
        sharedState: store.state,
        showArticle: false,
        currentArticle: null,
        valueToFilterBy: 'all',
        testWindow: this.$electron.remote.BrowserWindow,
        articleView: null,
        checkedArray: [],
        mdCheckbox: null,
        searchQuery: ''

      }
    },

    created () {
      this.getList()

    },

    mounted: function () {
      this.$electron.ipcRenderer.on('factorial-computed', function (event, url) {
        // console.log(url);
        store.addArticle(url)
      })
    },

    computed: {
      queryList: function () {
        // var vm = this
        // var pocketList = vm.filterByTag
        //
        // return _.filter(pocketList, function(item) {
        //   return _.includes(item.resolved_title.toLowerCase(), vm.searchQuery.toLowerCase())
        // })
      //
      //   _.debounce(function () {
      //     return _.filter(pocketList, function(item) {
      //        return _.includes(item.resolved_title.toLowerCase(), vm.searchQuery.toLowerCase())
      //     })
      //   }, 400)
      },

      uniqueTagList: function () {
        var vm = this
        let filteredList =  _.filter(vm.sharedState.pocketList, 'tags')

        filteredList =  _.mapValues(filteredList, 'tags')
        var testIds = _.map(filteredList, function(obj) {
          return _.valuesIn(obj)
        })



        var dup = _.flatten(testIds)

        console.log(_.mapValues(dup, 'item_id'));
        var dup = _.keyBy(dup, 'tag')
        console.log(dup);

        testIds = _.uniqBy(_.flatten(testIds), 'tag')

        return testIds
        // filteredList = _.map(filteredList, function(obj) {
        //   return _.keysIn(obj)
        // })
        // // console.log(return _.includes(iteratee, value, index + 1)filteredList);
        // console.log(_.uniq(_.flatten(filteredList)));
        // return _.uniq(_.flatten(filteredList))
      },

      duplicates: function () {
      var vm = this
        return _.filter(vm.sharedState.pocketList, _.matchesProperty('tags.tag.vue'))
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

      filterByTag: function () {

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

      },

      testFilterByMultipleTags: function (tagToFilterBy) {

        var pocketList = this.sharedState.pocketList

        function addTags(tag) {
          return 'tags.'+tag;
        }

        var filterByThese = _.map(this.valueToFilterBy, addTags)

        var arrayofArrays =  _.map(filterByThese, function(tag) {
          return _.filter(pocketList, function(item) {
            return _.has(item, tag)
          })
        })

        return _.reduce(arrayofArrays, function(flattened, other) {
          return _.uniq(flattened.concat(other));
        }, []);
      }
    },

    methods: {

      addArticle: function () {
        store.addArticle()
      },

      windowCommunication: function () {
        const windowID = BrowserWindow.getFocusedWindow().id
        mainWindow.webContents.on('did-finish-load', function () {
          const input = 100
          mainWindow.webContents.send('compute-factorial', input, windowID)
        })
      },

      launchArticleView: function (url) {
        this.$electron.ipcRenderer.send('openArticleWindow', url);

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
      },

      handleKeyUp: function () {
      }
    },

    name: 'landing-page'
  }
</script>

<style lang="scss">

.flip-list-move {
  transition: transform 1s;
}

.list-complete-item {
  transition: all 1.3s ease-out;
  margin: 1em 3em;
  width: 200px;
}
.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  transform: translateY(100px);
}
.list-complete-leave-active {
  position: absolute;
  transition: all .6s ease;
}


  .md-switch, .cursor {
    cursor: pointer;
  }
  .list, ul {
    display: inline-flex;
    // width: 70%;
    left: 200px;
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
    padding-top: 2em;

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
    width: 200px;
    left: 0;
    overflow-y: auto;
    top: 0;
    height: 100%;
    padding: 6em 1em 2em 1em;

    & label {
      color: #1c1b1b;
      font-size: 15px;
      font-family: "Roboto";
      letter-spacing: .5px;
      line-height: 1.7;
      text-transform: capitalize;
      margin-bottom: -1em;
      cursor: pointer;
      font-weight: 400;

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
