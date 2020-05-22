<template>
  <v-speed-dial fixed bottom right
    v-model="fab"
    direction="top"
    transition="slide-y-reverse-transition">
    <template v-slot:activator>
      <v-btn fab
        v-model="fab"
        color="primary">
        <v-icon v-if="fab">close</v-icon>
        <v-icon v-else>add</v-icon>
      </v-btn>
    </template>
    <v-btn fab small
      color="error"
      title="New Debit"
      @click="addRecords('debit')">
      <v-icon>remove</v-icon>
    </v-btn>
    <v-btn fab small
      color="primary"
      title="New Credit"
      @click="addRecords('credit')">
      <v-icon>add</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'AppFloatingButton',
  data: () => ({
    fab: false
  }),
  methods: {
    addRecords (type) {
      this.$router.push({
        name: 'recordsAdd',
        query: { type }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
