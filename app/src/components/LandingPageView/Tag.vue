<template lang="html">
  <li class="tag">

    <transition name="fade" mode="out-in">
      <input type="text" name="name"
        v-if="editingTag"
        @keyup.enter="saveTag(tag.tag)"
        v-model="tag.tag">
      <label v-else @click="editingTag = !editingTag">{{tag.tag}}</label>
    </transition>

  </li>
</template>

<script>
import {store} from '../../api'

export default {
  data() {
    return {
      editingTag: false,
      articleTest: null
    };
  },

  props: ['tag'],

  computed: {},

  mounted() {
    document.addEventListener("keydown", (e) => {
      if (this.editingTag && e.keyCode == 27) {
        this.editingTag = false
      }
    });
  },
  attached() {},

  methods: {
    toggleEditingTag: function () {
      // console.log('fired');
      // this.editingTag = true

    },
    saveTag: function (tagValue) {
      this.editingTag = false
      store.addTags()
    }
  },

  components: {},

  name: 'tag'
}
</script>

<style lang="scss">
  .tag {
    display: inline-block;
    margin: .5em .25em 0 0;

    & label {
      cursor: pointer;
      background: #909090;
      border-radius: 3px;
      color: white;
      padding: 3px;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s ease;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
