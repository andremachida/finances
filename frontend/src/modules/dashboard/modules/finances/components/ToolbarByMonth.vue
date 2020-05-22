<template>
  <v-app-bar :color="color">
    <v-layout align-center>
      <v-flex xs1>
        <div class="text-left">
          <v-btn icon
            @click="decrement">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </div>
      </v-flex>
      <v-flex xs10>
        <v-toolbar-title class="text-center">
          <span>{{ currentMonth }}</span>
        </v-toolbar-title>
      </v-flex>
      <v-flex xs1>
        <div class="text-left">
          <v-btn icon
            @click="increment">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-app-bar>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ToolbarByMonth',
  props: {
    format: String,
    color: String,
    month: String
  },
  computed: {
    currentMonth () {
      return this.date.format('MMMM YYYY')
    }
  },
  data: () => ({
    date: undefined
  }),
  methods: {
    emit () {
      this.$emit('month', this.date.format(this.format))
    },
    increment () {
      this.date = this.date.clone().add(1, 'month')
      this.emit()
    },
    decrement () {
      this.date = this.date.clone().subtract(1, 'month')
      this.emit()
    },
    setCurrentMonth () {
      this.date = this.month ? moment(this.month, this.format) : moment()
    }
  },
  created () {
    this.setCurrentMonth()
    this.emit()
  }
}
</script>

<style lang="scss" scoped>

</style>
