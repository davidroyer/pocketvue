<style scoped>
  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    list-style-type: none;
    justify-content: space-between;
  }
</style>

<template>
  <div>




<ul class="list">
  <pocket-item v-for="item in sharedState.pocketList"
    :item="item">
  </pocket-item>
</ul>

  </div>
</template>

<script>
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import {store} from '../api'
  import PocketItem from './LandingPageView/PocketItem'

  export default {
    components: {
      Links,
      Versions,
      PocketItem
    },

    data () {
      return {
        sharedState: store.state
      }
    },

    name: 'landing-page'
  }
</script>
