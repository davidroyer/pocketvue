<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:300);

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
