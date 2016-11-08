<template lang="html">
  <div class="login">
    <h1>Login Area</h1>
    <div class="temp-button-row">
      <md-button id="authorize-app" v-if="!sharedState.isAuthorized" class="md-raised md-accent" @click="authorizeApp">Connect PocketVue To Your Account</md-button>
      <md-button id="get-token" class="md-raised md-accent" @click="newLoginMethod">Login</md-button>
    </div>
<!--
    <webview id="test" src="https://www.github.com/" style="display:inline-flex; width:100%; height:100vh" disablewebsecurity ></webview> -->

    <webview v-show="sharedState.showWebView" id="pocket-test" :src="sharedState.webViewUrl" disablewebsecurity style="display:inline-flex; width:100%; height:100vh" ></webview>
  </div>
</template>

<script>
import {store} from '../api'

export default {
  data() {
    return {
      sharedState: store.state,
      dataUserIsAuthorized: false
    }
  },
  computed: {
  },

  mounted: function () {
    store.setLocalStorageConfig()
    this.checkUserAuthorized()
    this.getPocketViewInfo()

  },

  methods: {
    setAccessToTrue: function () {
      console.log('working');
      this.sharedState.hasAccessToken = true
      this.sharedState.loggedIn = true

      // this.sharedState.authCode === 'true'
    },

    getPocketViewInfo: function () {
      const pocketWebview = document.getElementById('pocket-test')
      var vm = this

      pocketWebview.addEventListener('did-get-redirect-request', (event, oldURL, newURL) => {
        if (event.newURL == 'https://google.com/') {
          alert('You can login now')
          vm.sharedState.showWebView = false
        }
      })
    },

    loginUsingView: function () {
      this.$emit('userLoggingIn')
    },

    checkUserAuthorized: function () {
        if (localStorage.userIsAuthorized == 'false') {
            this.sharedState.isAuthorized = false
        } else {
          this.sharedState.isAuthorized = true
        }
    },

    authorizeApp: function () {
      store.runNodeAuth();
    },

    getToken: function () {
      store.runGetAccessToken()
    },

    newLoginMethod: function () {
      store.runGetAccessToken()
    }
  },

  components: {}
};
</script>

<style lang="scss">
  .users {
    padding-left: 0;
    list-style-type: none;

    & li {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      align-content: inherit;
    }

    & i {
      font-size: 65px;
    }
  }

  .temp-button-row {
    // display: none;
  }
</style>
