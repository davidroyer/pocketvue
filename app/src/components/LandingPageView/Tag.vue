<template lang="html">
  <li class="tag">
    {{tag.tag}}
  </li>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: ['tag'],
  computed: {},
  ready() {},
  attached() {},
  methods: {},
  components: {}
};
</script>

<style lang="scss">
  .tag {
    display: inline-block;
    margin: .5em .25em 0 0;
    background: #909090;
    border-radius: 3px;
    color: white;
    padding: 3px;
  }
</style>
