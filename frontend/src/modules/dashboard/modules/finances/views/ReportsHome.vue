<template>
  <v-layout row wrap>
    <v-flex xs12>
      <ToolbarByMonth
        format="MM-YYYY"
        :color="color"
        :month="month || $route.query.month"
        @month="changeMonth" />
    </v-flex>
    <v-flex xs12 sm6
      v-for="chart in charts"
      :key="chart.title">
      <v-card>
        <v-card-text>
          <h2 class="font-weight-light mb-4">{{ chart.title }}</h2>
          <canvas :ref="chart.refId"></canvas>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import Chart from 'chart.js'
import { generateChartConfigs } from '../../../../../utils'

import RecordsService from '../services/records-service'

import ToolbarByMonth from '../components/ToolbarByMonth.vue'

export default {
  name: 'RecordsHome',
  components: {
    ToolbarByMonth
  },
  computed: {
    ...mapState('finances', ['month']),
    recordsSum () {
      return this.records.reduce((accumulated, record) => accumulated + record, 0)
    },
    color () {
      return this.recordsSum < 0 ? 'error' : 'primary'
    }
  },
  data: () => ({
    monthSubject$: new Subject(),
    records: [],
    subscriptions: [],
    charts: [
      { title: 'Credit x Debit', refId: 'chartIncomesExpenses' },
      { title: 'Debit by Category', refId: 'chartCategoryExpenses' }
    ],
    chartIncomesExpenses: undefined,
    chartCategoryExpenses: undefined
  }),
  methods: {
    ...mapActions(['setTitle']),
    ...mapActions('finances', ['setMonth']),
    changeMonth (month) {
      this.$router.push({
        path: this.$route.path,
        query: { month }
      })
      this.setMonth({ month })
      this.monthSubject$.next(month)
    },
    setRecords () {
      this.subscriptions.push(
        this.monthSubject$
          .pipe(
            mergeMap(month => RecordsService.records({ month }))
          ).subscribe(records => {
            this.records = records
            this.setCharts()
          })
      )
    },
    setCharts () {
      this.updateOrCreateChart('chartIncomesExpenses', generateChartConfigs({
        type: 'bar',
        items: this.records,
        keyToGroup: 'type',
        keyOfValue: 'amount',
        aliases: { CREDIT: 'Credit', DEBIT: 'Debit' },
        backgroundColors: [
          this.$vuetify.theme.currentTheme.primary,
          this.$vuetify.theme.currentTheme.error
        ]
      }))

      this.updateOrCreateChart('chartCategoryExpenses', generateChartConfigs({
        type: 'doughnut',
        items: this.records.filter(r => r.type === 'DEBIT'),
        keyToGroup: 'category.description',
        keyOfValue: 'amount'
      }))
    },
    updateOrCreateChart (chartId, options) {
      if (this[chartId]) {
        this[chartId].data.datasets = options.data.datasets
        if (options.data.labels) {
          this[chartId].data.labels = options.data.labels
        }
        this[chartId].update()
        return this[chartId]
      }
      const ref = Array.isArray(this.$refs[chartId]) ? this.$refs[chartId][0] : this.$refs[chartId]
      const context = ref.getContext('2d')

      this[chartId] = new Chart(context, options)
      return this[chartId]
    }
  },
  created () {
    this.setTitle({ title: 'Reports' })
    this.setRecords()
  },
  destroyed () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
</script>

<style lang="scss" scoped>

</style>
