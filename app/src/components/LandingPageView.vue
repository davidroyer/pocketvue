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
        <!-- <label class="cursor">
          <md-switch v-model="checkedArray" :value="tag" :id="tag" :name="tag"></md-switch>
          {{tag}}
        </label> -->
        <!-- <input type="checkbox" :id="tag" :value="tag" v-model="checkedArray" :name="tag">
        <label :for="tag">{{tag}}</label> -->
      </div>
    </div>

    <!-- <transition-group name="flip-list" tag="ul">
      <pocket-item v-for="item in this.sharedState.pocketList"
        @articleUrlSelected="launchArticleView"
        :item="item"
        :key="item.item_id">
      </pocket-item>
    </transition-group> -->

    <transition-group name="list-complete" tag="ul">
      <pocket-item v-for="item in filterByTag"
        @articleUrlSelected="launchArticleView"
        :item="item"
        :key="item.item_id">
      </pocket-item>
    </transition-group>

    <div class="article__wrapper " v-show="showArticle">
      <md-button class="md-icon-button close-article md-raised md-accent" @click="toggleArticleViewer">
        <md-icon>arrow_back</md-icon>
            <webview id="articleFrame" src="https://www.github.com/" style="display:inline-flex; width:inherit; height:inherit" ></webview>
      </md-button>
    </div>

  </div>
</template>

<script>
  const {BrowserWindow, screen, webContents, dialog} = require('electron').remote
  const path = require('path')
  import {store} from '../api'
  import PocketItem from './LandingPageView/PocketItem'
  var request = require('request')

  import _ from 'lodash'
  const electron = require('electron')
  import bus from '../bus'


  export default {
    components: {
      PocketItem
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
        mdCheckbox: null

      }
    },

    created () {
      this.getList()

    },

    mounted: function () {
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

        var filterByThese = _.map(this.checkedArray, addTags)

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
  // display: inline-block;
  // margin-right: 10px;
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
    width: 250px;
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
