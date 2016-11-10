<template lang="html">
  <div class="login">
    <h1>Login Area</h1>
    <div class="temp-button-row">
      <md-button id="get-token" v-if="sharedState.hasAccessToken" class="md-raised md-accent" @click="runLoginProcess">Login</md-button>
      <md-button id="authorize-app" v-if="!sharedState.isAuthorized" class="md-raised md-accent" @click="authorizeApp">Connect PocketVue To Your Account</md-button>
      <md-button id="config" class="md-raised md-accent" @click="runResetConfigStore">Reset Config Store</md-button>
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
    }
  },

  mounted: function () {
    this.getPocketViewInfo()

  },

  methods: {

    getPocketViewInfo: function () {
      const pocketWebview = document.getElementById('pocket-test')
      var vm = this

      pocketWebview.addEventListener('did-get-redirect-request', (event, oldURL, newURL) => {
        if (event.newURL == 'https://google.com/') {
          alert('You can login now')
          vm.sharedState.showWebView = false
          store.hasRequestToken()
        }
      })
    },

    loginUsingView: function () {
      this.$emit('userLoggingIn')
    },

    authorizeApp: function () {
      store.runNodeAuth();
    },

    runLoginProcess: function () {
      store.runGetAccessToken()
    },

    runResetConfigStore: function () {
      store.resetConfig()
    },

    runHasRequestToken: function () {
      store.setAccessToken
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
