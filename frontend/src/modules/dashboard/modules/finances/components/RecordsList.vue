<template>
  <div>
    <TotalBalance />
    <ToolbarByMonth
      format="MM-YYYY"
      @month="changeMonth"
      :color="toolbarColor"
      :month="month || $route.query.month"
      :showSlot="true">
      <RecordsFilter
        @filter="filter" />
    </ToolbarByMonth>
    <v-card>
      <v-card-text class="text-center"
        v-if="mappedRecordsLength === 0">
        <v-icon size="100" color="grey">assignment</v-icon>
        <p class="font-weight-light subheading grey--text">
          Nenhum lançamento no período
        </p>
      </v-card-text>
      <v-list two-line subheader
        v-else>
        <template v-for="(records, date, index) in mappedRecords">
          <v-subheader :key="date">{{ date }}</v-subheader>
          <RecordsListItem
            v-for="record in records"
            :key="record.id"
            :record="record" />
          <v-divider v-if="showDivider(index, mappedRecords)" :key="`${date}-${index}`"></v-divider>
        </template>
      </v-list>
      <v-footer class="pa-2">
        <v-flex text-right>
          <h3 class="font-weight-light">
            <span>Saldo do mês:</span>
            <strong class="ml-5" :class="amountColor(totalAmount)">{{ formatCurrency(totalAmount) }}</strong>
          </h3>
        </v-flex>
      </v-footer>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { groupBy } from '../../../../../utils'
import amountColorMixin from '../mixins/amoun-color'
import formatCurrencyMixin from '../../../../../mixins/format-currency'
import RecordsService from '../services/records-service.js'

import RecordsListItem from './RecordsListItem.vue'
import ToolbarByMonth from './ToolbarByMonth.vue'
import TotalBalance from './TotalBalance.vue'
import RecordsFilter from './RecordsFilter.vue'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'RecordsList',
  components: {
    RecordsListItem,
    ToolbarByMonth,
    TotalBalance,
    RecordsFilter
  },
  mixins: [
    amountColorMixin,
    formatCurrencyMixin
  ],
  data: () => ({
    records: [],
    filtersSubject$: new Subject(),
    subscriptions: []
  }),
  computed: {
    ...mapState(['filters', 'month']),
    mappedRecords () {
      return groupBy(this.records, 'date', (record, dateKey) => {
        return moment(record[dateKey].substr(0, 10)).format('DD/MM/YYYY')
      })
    },
    totalAmount () {
      return this.records.reduce((sum, record) => {
        return sum + record.amount
      }, 0)
    },
    mappedRecordsLength () {
      return Object.keys(this.mappedRecords).length
    },
    toolbarColor () {
      return this.totalAmount < 0 ? 'error' : 'primary'
    }
  },
  methods: {
    ...mapActions(['setMonth']),
    showDivider (index, object) {
      return index < Object.keys(object).length - 1
    },
    changeMonth (month) {
      this.$router.push({
        path: this.$route.path,
        query: { month }
      })
      this.setMonth({ month })
      this.filter()
    },
    setRecords (month) {
      this.subscriptions.push(
        this.filtersSubject$
          .pipe(
            mergeMap(variables => RecordsService.records(variables))
          ).subscribe(records => (this.records = records))
      )
    },
    filter () {
      this.filtersSubject$.next({ month: this.month, ...this.filters })
    }
  },
  created () {
    this.setRecords()
  },
  destroyed () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
</script>

<style lang="scss" scoped>

</style>
