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

    <!-- <ul>
      <li v-for="tagsForItem in tags">
      <span v-for="tag in tagsForItem">
        {{tag.tag}}
      </span>
      </li>
    </ul> -->
            <!-- @click.native="getArticleContent(item.resolved_url)" -->
    <ul class="list">
      <pocket-item v-for="item in sharedState.pocketList"
        @click.native="getArticleContent(item.resolved_url)"
        :item="item">
      </pocket-item>

    </ul>

    <div class="article__wrapper wysiwyg" v-if="showArticle && currentArticle !== null ">
      <button type="button" name="button" @click="toggleArticleViewer">Close Article</button>
      <div v-html="currentArticle.content"></div>
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
      }
    },
    methods: {
      getArticleContent: function (url) {
        let $vm = this
        this.showArticle = true
        extractor.extractData(url, function (err, data) {
          // console.log(data.content);
          $vm.currentArticle = data
        });
      },

      toggleArticleViewer: function () {
        this.showArticle = !this.showArticle
      }
    },

    name: 'landing-page'
  }
</script>
