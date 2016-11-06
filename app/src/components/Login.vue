<template lang="html">
  <div class="login" v-on:click="">
    <h1>Login Area</h1>

    <!-- <ul class="users">
      <li v-for="user in sharedState.users">
        <md-icon class="md-primary">account_circle</md-icon>
        <h3 :id="user.access_token">{{user.username}}</h3>
        <md-button id="id-test" class="md-raised md-accent" @click="$emit('userLoggingIn', user.access_token)">Login</md-button>
      </li>
    </ul> -->

    <!-- <md-button id="id-test" class="md-raised md-accent" @click="$emit('userLoggingIn')">Login</md-button> -->
<div class="temp-button-row">
  <md-button id="authorize-app" v-if="!sharedState.isAuthorized" class="md-raised md-accent" @click="authorizeApp">Connect PocketVue To Your Account</md-button>
  <md-button id="get-token" class="md-raised md-accent" @click="newLoginMethod">Login</md-button>
  <!-- <md-button id="get-token" class="md-raised md-accent" @click="getToken">Get Token After Authorization</md-button>
  <md-button id="get-token" class="md-raised md-accent" @click="getUsers">Get Users</md-button> -->
</div>

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
    var $vm = this
    $vm.getUsers()
    store.setLocalStorageConfig()
    this.checkUserAuthorized()
    // $vm.$nextTick($vm.getUsers())
  },

  methods: {
    setAccessToTrue: function () {
      console.log('working');
      this.sharedState.hasAccessToken = true
      this.sharedState.loggedIn = true

      // this.sharedState.authCode === 'true'
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

    getUsers: function () {
      store.getUsers()
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
