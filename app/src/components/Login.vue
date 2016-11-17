<template lang="html">
  <div class="login">
    <h1 class="login_title">Get Started With PocketVue</h1>

    <transition name="fade" mode="out-in">
      <md-button id="get-token" v-if="sharedState.isAuthorized" key="login" class="md-raised md-accent" @click="runLoginProcess">Login</md-button>

      <md-button id="authorize-app" v-if="!sharedState.isAuthorized" class="md-raised md-accent" key="authorize" @click="authorizeApp">Connect PocketVue To Your Account</md-button>
    </transition>

    <div>
      <md-button id="config" class="md-raised md-accent" v-if="sharedState.isAuthorized" key="config" @click="runResetConfigStore">Reset Config Store</md-button>
    </div>
    <transition name="fade">
      <webview v-show="sharedState.showWebView" id="pocket-test" :src="sharedState.webViewUrl" disablewebsecurity style="display:inline-flex; width:100%; height:100vh" ></webview>
    </transition>

  </div>
</template>

<script>
import {store} from '../SharedStore'




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

    toggleState: function () {
      console.log('toggle fired');
      this.sharedState.isAuthorized = !this.sharedState.isAuthorized
    },

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

  .login {
    display: flex;
    justify-content: flex-start;;
    align-items: center;
    // height: calc(100vh - 250px);
    flex-direction: column;
    text-align: center;

    &_title {
      font-size: 3em;
      line-height: 1.3;
    }

    & > * {
      margin: 1em 0;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
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
