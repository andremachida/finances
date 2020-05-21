<template>
  <v-list two-line subheader>
    <template v-for="(records, date, index) in mappedRecords">
      <v-subheader :key="date">{{ date }}</v-subheader>
      <RecordsListItem
        v-for="record in records"
        :key="record.id"
        :record="record" />
      <v-divider v-if="showDivider(index, mappedRecords)" :key="`${date}-${index}`"></v-divider>
    </template>
  </v-list>
</template>

<script>
import moment from 'moment'
import { groupBy } from '../../../../../utils'
import RecordsListItem from './RecordsListItem.vue'
import RecordsService from '../services/records-service.js'

export default {
  name: 'RecordsList',
  components: {
    RecordsListItem
  },
  data: () => ({
    records: []
  }),
  computed: {
    mappedRecords () {
      return groupBy(this.records, 'date', (record, dateKey) => {
        return moment(record[dateKey]).format('DD/MM/YYYY')
      })
    }
  },
  methods: {
    showDivider (index, object) {
      return index < Object.keys(object).length - 1
    }
  },
  async created () {
    this.records = await RecordsService.records()
  }
}
</script>

<style lang="scss" scoped>

</style>
