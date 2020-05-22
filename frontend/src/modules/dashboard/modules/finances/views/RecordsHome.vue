<template>
  <RecordsList />
</template>

<script>
import { mapActions } from 'vuex'

import RecordsList from '../components/RecordsList.vue'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  },
  methods: {
    ...mapActions(['setTitle'])
  },
  created () {
    this.setTitle({ title: 'Release' })
  }
}
</script>

<style lang="scss" scoped>

</style>
