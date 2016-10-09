<template lang="html">

  <li class="item">
    <a :href="item.resolved_url" target="_blank">
      {{item.resolved_title}}
    </a>
    <ul class="tag_list" v-if="typeof item.tags === 'object' ">
      <!-- <li v-for="tag in item.tags">
        {{tag.tag}}
      </li> -->
      <tag v-for="tag in item.tags"
        :tag="tag">
      </tag>
    </ul>
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
  computed: {},
  ready() {},
  attached() {},
  methods: {},
  components: { Tag },

  name: 'pocket-item'
};
</script>

<style lang="scss">
  .item {
    min-width: 240px;
    box-sizing: border-box;
    min-height: 120px;
    margin: 2em 1em;
    background-color: #f9f9f9;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    flex: 1;

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

    &_list {
      margin-top: 5px;
    }
  }
</style>
