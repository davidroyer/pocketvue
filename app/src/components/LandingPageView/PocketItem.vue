<template lang="html">

  <li class="article_card-wrapper list-complete-item">
    <md-card class="article_card">


      <div class="md-card-link" @click="testEmit(item)">
        <md-card-header>
          <div class="md-title">{{item.resolved_title}}</div>
            <img v-if="item.has_image == true" v-bind:src="item.image.src" alt="" class="article_image"/>
            <img v-if="item.has_image == false" src="https://upload.wikimedia.org/wikipedia/en/2/2e/Pocket_App_Logo.png" alt="" class="pocket-logo article_image" />
        </md-card-header>
        <md-card-content>
        {{item.excerpt}}
        </md-card-content>
      </div>

    <!--  IMPLEMENT THIS AT SOME POINT -->
    <!-- <div class="md-card-link" @click="testEmit(item.resolved_url)">
      <div class="background"  v-if="item.has_image == true">
        <div class="image" v-bind:style="{ 'background-image': 'url(' + item.image.src + ')'}">
        </div>
      </div>
    </div> -->

      <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions>
      <!-- <ul class="tag_list" v-if="typeof item.tags === 'object' ">
        <tag v-for="tag in item.tags"
          :tag="tag">
        </tag>
      </ul> -->
    </md-card>
  </li>


</template>

<script>
import Tag from './Tag'
export default {
  data() {
    return {
    };
  },
  props: ['item'],
  computed: {
    styleObject: function () {
      if (this.currentPost !== undefined) {
        return {
          backgroundColor: this.currentPost.slug
        }
      }
    },
  },
  ready() {},
  attached() {},
  methods: {
    testEmit: function (item) {
      console.log(item.resolved_id);
      this.$emit('articleUrlSelected', item.resolved_url)

    },

    logImage: function () {
      console.log('image not found');
    }
  },
  components: { Tag },

  name: 'pocket-item'
};
</script>

<style lang="scss">

  .image {
    height: 175px;
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    background-position: center;
  }
.md-card {

  &-actions {
    justify-content: flex-end;
    margin-top: auto;
    display: none !important;
  }

  .md-title {
    line-height: 1.2;
        top: 55px !important;
        position: relative;
        font-weight: 400;
        font-size: 19px;
  }

  &-header {
    height: 66px;
    background: #ddd;
  }

  &-content {
    display: none;
  }
}


  .article_card {
    // padding: 1em 2em;
    overflow: initial;
    height: 200px;
    // height: 475px !important;
    transition: .3s ease;

    &:hover {
      cursor: pointer;
      box-shadow: 0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);
      transform: scale(1.03);
    }

    &-wrapper {
      // max-width: 300px;
      // width: 200px;
      // margin: 1em 1em;

      &:nth-of-type(1), &:nth-of-type(2) {
          // margin-top: 1.75em;
      }
    }

    & .article_image {
      max-height: 120px;
      display: block;
      margin-right: auto;
      margin-left: auto;

      position: absolute;
      max-height: 66px;
      height: auto;
      top: 0;
      left: 0;
      right: 0;
    }
  }
  img {
    max-width: 100%;
  }
  .item {
    min-width: 240px;
    box-sizing: border-box;
    min-height: 120px;
    margin: 2em 1em;
    background-color: #f9f9f9;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    flex: 1;
    cursor: pointer;
    transition: background-color .3s ease;
    padding: 1em;
    position: relative;

    &:hover {
      background-color: #e1e1e1;
    }

    & > a {
      display: block;
      height: 100%;
      width: 100%;
      padding: 1em 1em 1.5em;
      color: dimgray;
      font-weight: 900;
      transition: all .3s ease;

      &:hover {
        background-color: gainsboro;
      }
    }
  }

  .tag {
    margin-top: 5px;


    &_list {
      margin-top: 5px;
      position: absolute;
      top: 100%;
      padding-left: 0;

    }

    & label {

      &:hover {
        background: #636363;
      }
    }
  }

  .pocket-logo {
    display: block;
    background: #dddddd;
    padding: 10px;
  }

  .md-card-actions {
    display: none;
  }
</style>
