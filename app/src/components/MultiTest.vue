<template lang="html">
  <div class="multiTest">
      <h1>MultiSelect Component</h1>
<div>
  <multiselect
    :options="countries",
    :value="selectedCountries",
    :multiple="multiple",
    :searchable="searchable",
    @search-change="asyncFind",
    placeholder="Type to search",
    label="name"
    :track-by="code">
    span(slot="noResult").
      Oops! No elements found. Consider changing the search query.
  </multiselect>
  <!-- span(slot="noResult").
    Oops! No elements found. Consider changing the search query. -->
</div>
  </div>

</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  components: { Multiselect },
  data () {
    return {
      selected: null,
      options: ['list', 'of', 'options']
    }
  },
  methods: {
    updateSelected (newSelected) {
      this.selected = newSelected
    },
    asyncFind (query) {
      this.countries = findService(query)
    }
  }
}
</script>

<style lang="scss">
.multiTest {
    position: fixed;
    background: white;
    top: 65px;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 999999;
    height: 100vh;
    padding: 1em;
}
</style>
