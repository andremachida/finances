<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />
  </div>
</template>

<script>
import AppToolbar from './AppToolbar.vue'
import AppMenu from './AppMenu.vue'

export default {
  name: 'AppLayout',
  components: {
    AppToolbar,
    AppMenu
  },
  data: () => ({
    drawer: false
  })
}
</script>

<style lang="scss" scoped>

</style>
