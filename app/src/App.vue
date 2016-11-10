<style lang="scss">

  @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,600,600i,700|Roboto:300,400,400i,500,700,900|Roboto+Condensed:300,400,700);

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }


  .content {
    padding: 30px 15px;
  }

  html,
  body { height: 100%; }

  body {

    background:
      radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      );
    background-position: center;

    font-family: Roboto, Helvetica, sans-serif;

  }

  .md-toolbar {
    z-index: 9;
    height: 80px;
    -webkit-app-region: drag;

    & .md-title {
        flex: 1;
        margin-left: 3px;
        margin-top: 15px;
        font-weight: 700;
        font-size: 3em;
        letter-spacing: 1px;
        font-family: "Roboto Condensed";
        font-style: italic;
        left: 70px;
        position: relative;
        top: -10px;
      }
  }
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-active {
    opacity: 0;
  }

  .appTags-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999999;
    background-color: #fff;
  }
</style>

<template>

  <div v-md-theme="'default'" >
    <div class="header">
      <md-toolbar>
        <!-- <md-button class="md-icon-button" @click="toggleLeftSidenav">
          <md-icon>menu</md-icon>
        </md-button> -->

        <h2 class="md-title">PocketVue</h2>
        <md-button class="md-raised md-accent"
          @click="logUserOut">
          Logout
        </md-button>
      </md-toolbar>
    </div>

    <div class="content">

      <transition name="component-fade" mode="out-in">
        <component v-on:userLoggingIn="logUserIn" v-bind:is="sharedState.view"></component>
      </transition>

    </div>

    <div class="sidebar">
      <md-sidenav class="md-left" ref="leftSidenav">
        <md-toolbar class="md-large">
          <div class="md-toolbar-container">
            <h3 class="md-title">Sidenav content</h3>
          </div>
        </md-toolbar>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi cupiditate esse necessitatibus beatae nobis, deserunt ut est fugit, tempora deleniti, eligendi commodi doloribus. Nemo, assumenda possimus, impedit inventore perferendis iusto!</p>
      </md-sidenav>
    </div>

  </div>
</template>

<script>
import LandingPage from './components/LandingPageView'
import Login from './components/Login'
import {store} from './api'
import _ from 'lodash'

  export default {
    components: {
      LandingPage,
      Login
    },

    data () {
      return {
        sharedState: store.state,
        tagsOne: null,
        // uniqueTagList: Array,
        tagList: null
      }
    },

    created: function () {
      // store.fetchMyList();

    },

    mounted: function () {
      // this.appTags()
      store.checkForAccessToken()
    },

    computed: {

    },

    methods: {
      logUserOut: function () {
        console.log('logout ran');
        this.sharedState.loggedIn = false
        localStorage.removeItem('requestToken')
        this.sharedState.view = 'Login'
      },

      logUserIn: function (token) {
        this.view = 'LandingPage'
        this.sharedState.loggedIn = false
      },

      toggleLeftSidenav() {
        this.$refs.leftSidenav.toggle();
      },

      setViewToLandingPage: function () {
        this.sharedState.loggedIn = true
        this.view = 'LandingPage'
      },

      setViewToLoginPage: function () {
        this.sharedState.loggedIn = false
        this.view = 'Login'
      }
    }
  }
</script>
<!-- <landing-page v-if="sharedState.loggedIn"></landing-page>
<login v-else></login> -->
