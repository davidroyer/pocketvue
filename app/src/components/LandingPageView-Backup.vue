<style lang="scss" scoped>
  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    list-style-type: none;
    justify-content: space-between;
  }

  .article {
    &__wrapper {
      position: fixed;
      top: 0;
      right: 0;
      width: 40%;
      bottom: 0;
      background-color: #fdfdfd;
      height: 100%;
      overflow-y: auto;
      padding: 2em;
    }
  }
</style>

<template>
  <div>

    <!-- <md-toolbar>
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 class="md-title">My App</h2>
    </md-toolbar> -->
    <!-- <ul>
      <li v-for="tagsForItem in tags">
      <span v-for="tag in tagsForItem">
        {{tag.tag}}
      </span>
      </li>
    </ul> -->
            <!-- @click.native="getArticleContent(item.resolved_url)" -->
    <button type="button" name="button" @click="getRequestToken">Get Pocket Request Token</button>
    <button type="button" name="button" @click="goToUrl">Go To Url</button>
    <button type="button" name="button" @click="getAccessToken">Get Pocket Access Token</button>
    <button type="button" name="button" @click="getList">Get Pocket Posts</button>
    <button type="button" name="button" @click="getMyList">Get My Pocket List</button>
    <md-button class="md-raised md-accent">Accent</md-button>
    <ul class="list">
      <pocket-item v-for="item in sharedState.pocketList"
        @click.native="showWebArticle(item.resolved_url)"
        :item="item">
      </pocket-item>

    </ul>


    <div class="article__wrapper wysiwyg" v-show="showArticle">
      <button type="button" name="button" @click="toggleArticleViewer">Close Article</button>
      <!-- <div v-html="currentArticle.content"></div> -->
      <webview id="foo" src="https://www.github.com/" style="display:inline-flex; width:640px; height:480px" ></webview>

    </div>

  </div>
</template>

<script>
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import {store} from '../api'
  import PocketItem from './LandingPageView/PocketItem'
  var extractor = require('article-extractor');
  require('../../node_modules/wysiwyg.css/wysiwyg.css')
  var request = require('request')
  console.log(request);
  import _ from 'lodash'

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
        currentArticle: null
      }
    },

    computed: {
      tags: function() {

        var list =  this.sharedState.pocketList
            // console.log(users);
        let tagObjects =  _.mapValues(list, 'tags');


        return tagObjects

        // return _.findKey(list, ['has_video', '0']);
      },

      testFilterByTag: function () {
        var pocketList = this.sharedState.pocketList
        var itemsWithTags = _.filter(pocketList, function(item) {
          return item.tags

        })

        return  _.forEach(itemsWithTags, function(value, key) {
            _.forEach(value.tags, function(value, key) {
              return key.item_id
            })

        })
        //
        // return _.filter(itemsWithTags, function(item) {
        //     return _.hasIn(itemsWithTags, 'item.tags.tag1')
        //
        // })


      }
    },

    methods: {
      goToUrl: () => {
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

      getMyList: function () {
        store.fetchMyList()
      },

      showWebArticle: function (url) {
        console.log(this);
        const webview = document.getElementById('foo')
        console.log(url);
        webview.src = url
        this.showArticle = true
      },

      toggleArticleViewer: function () {
        this.showArticle = !this.showArticle
      }
    },

    name: 'landing-page'
  }
</script>
