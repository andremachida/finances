<template>
  <div>
    teste
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RecordsAdd',
  methods: {
    ...mapActions(['setTitle']),
    changeTitle (recordType) {
      let title
      switch (recordType) {
        case 'credit':
          title = 'New Credit'
          break
        case 'debit':
          title = 'New Debit'
          break
        default:
          title = 'New Release'
      }
      this.setTitle({ title })
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.changeTitle(to.query.type)
    next()
  },
  created () {
    this.changeTitle(this.$route.query.type)
  }
}
</script>

<style lang="scss" scoped>

</style>
