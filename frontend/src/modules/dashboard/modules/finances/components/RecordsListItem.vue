<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-icon :class="[ recordIconColor(record.type), 'lighten-1 white--text' ]">
        {{ recordIcon(record.type) }}
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>{{ record.description }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ record.category.description }} | {{ record.account.description }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-icon>
      <span :class="amountColor(record.amount)">{{ formatCurrency(record.amount) }}</span>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
import amountColorMixin from '../mixins/amoun-color'
import formatCurrencyMixin from '../../../../../mixins/format-currency'

export default {
  name: 'RecordsListItem',
  mixins: [
    formatCurrencyMixin,
    amountColorMixin
  ],
  props: {
    record: Object
  },
  methods: {
    recordIcon (type) {
      return type === 'CREDIT' ? 'arrow_upward' : 'arrow_downward'
    },
    recordIconColor (type) {
      return type === 'CREDIT' ? 'primary' : 'error'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
