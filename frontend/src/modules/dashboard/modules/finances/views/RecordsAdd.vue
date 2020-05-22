<template>
  <v-container text-center>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <p>Amount</p>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card>
          <v-card-text>
            <v-form>
              <v-select
                v-model="record.accountId"
                :items="accounts"
                item-text="description"
                item-value="id"
                name="account"
                label="Account"
                prepend-icon="account_balance">

              </v-select>
              <v-select
                v-model="record.categoryId"
                :items="categories"
                item-text="description"
                item-value="id"
                name="category"
                label="Category"
                prepend-icon="class">

              </v-select>
              <v-text-field
                name="description"
                label="Description"
                prepend-icon="description"
                type="text">

              </v-text-field>
              <v-text-field
                name="tags"
                label="Tags"
                prepend-icon="label"
                type="text">

              </v-text-field>
              <v-text-field
                name="note"
                label="Notes"
                prepend-icon="note"
                type="text">

              </v-text-field>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import { decimal, minLength, required } from 'vuelidate/lib/validators'

import AccountsService from '../services/accounts-service'
import CategoriesService from '../services/categories-service'

import { mapActions } from 'vuex'

export default {
  name: 'RecordsAdd',
  data () {
    return {
      accounts: [],
      categories: [],
      record: {
        type: this.$route.query.type.toUpperCase(),
        amount: 0,
        date: moment().format('YYYY-MM-DD'),
        accountId: '',
        categoryId: '',
        description: '',
        tags: '',
        note: ''
      }
    }
  },
  validations: {
    record: {
      type: { required },
      amount: { required, decimal, different: value => value !== 0 },
      date: { required },
      accountId: { required },
      categoryId: { required },
      description: { required, minLength: minLength(6) }
    }
  },
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
  async beforeRouteUpdate (to, from, next) {
    const { type } = to.query
    this.changeTitle(type)
    this.record.type = type.toUpperCase()
    this.categories = await CategoriesService.categories({ operation: type })
    next()
  },
  async created () {
    this.changeTitle(this.$route.query.type)
    this.accounts = await AccountsService.accounts()
    this.categories = await CategoriesService.categories({ operation: this.$route.query.type })
  }
}
</script>

<style lang="scss" scoped>

</style>
