<style>
  /*@import url(https://fonts.googleapis.com/css?family=Lato:300);*/
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,600,600i,700|Roboto:300,400,400i,500)
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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

    font-family: Lato, Helvetica, sans-serif;

  }
</style>

<template>

  <div>
    <landing-page></landing-page>
  </div>
</template>

<script>
  import LandingPage from './components/LandingPageView'
  export default {
    components: {
      LandingPage
    }
  }
</script>
