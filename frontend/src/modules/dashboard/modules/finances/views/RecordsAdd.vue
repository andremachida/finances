<template>
  <v-container text-center>
    <v-layout row wrap>
      <v-flex xs12 sm4 fill-height>
        <NumericDisplay
          v-model="$v.record.amount.$model"
          :color="color" />
      </v-flex>
      <v-flex xs12 sm8>
        <v-card>
          <v-card-text>
            <v-form>
              <v-dialog persistent
                v-model="showDateDialog"
                ref="dateDialog"
                :return-value.sync="record.date"
                width="290px">
                <template v-slot:activator="{ on }">
                  <v-text-field readonly
                    name="date"
                    label="Due Date"
                    prepend-icon="event"
                    type="text"
                    v-on="on"
                    :value="formattedDate" />
                </template>
                <v-date-picker scrollable
                  v-model="dateDialogValue"
                  :color="color"
                  locale="pt-BR" >
                  <v-spacer></v-spacer>
                  <v-btn text
                    :color="color"
                    @click="cancelDateDialog">
                    Cancel
                  </v-btn>
                  <v-btn text
                    :color="color"
                    @click="$refs.dateDialog.save(dateDialogValue)">
                    Ok
                  </v-btn>
                </v-date-picker>
              </v-dialog>
              <v-select
                v-model="$v.record.accountId.$model"
                :items="accounts"
                item-text="description"
                item-value="id"
                name="account"
                label="Account"
                prepend-icon="account_balance">

              </v-select>
              <v-select
                v-model="$v.record.categoryId.$model"
                :items="categories"
                item-text="description"
                item-value="id"
                name="category"
                label="Category"
                prepend-icon="class">

              </v-select>
              <v-text-field
                v-model.trim="$v.record.description.$model"
                name="description"
                label="Description"
                prepend-icon="description"
                type="text">

              </v-text-field>
              <v-text-field
                v-show="showTagsInput"
                v-model.trim="record.tags"
                name="tags"
                label="Tags"
                prepend-icon="label"
                type="text">

              </v-text-field>
              <v-text-field
                v-show="showNoteInput"
                v-model.trim="record.note"
                name="note"
                label="Notes"
                prepend-icon="note"
                type="text">

              </v-text-field>
            </v-form>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn icon small
                  class="mr-3"
                  v-on="on"
                  @click="showTagsInput = !showTagsInput">
                  <v-icon :color="color">label</v-icon>
                </v-btn>
              </template>
              <span>Add Tags</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn icon small
                  v-on="on"
                  @click="showNoteInput = !showNoteInput">
                  <v-icon :color="color">note</v-icon>
                </v-btn>
              </template>
              <span>Notes</span>
            </v-tooltip>
          </v-card-text>
        </v-card>
        <v-btn large fab
          color="secondary"
          class="mt-4"
          @click="$router.back()">
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn large fab
          :color="color"
          class="mt-4"
          :disabled="$v.$invalid"
          @click="submit">
          <v-icon>check</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'
import { decimal, minLength, required } from 'vuelidate/lib/validators'

import AccountsService from '../services/accounts-service'
import CategoriesService from '../services/categories-service'

import NumericDisplay from '../components/NumericDisplay.vue'

import { mapActions } from 'vuex'

export default {
  name: 'RecordsAdd',
  components: {
    NumericDisplay
  },
  computed: {
    color () {
      switch (this.record.type) {
        case 'CREDIT':
          return 'primary'
        case 'DEBIT':
          return 'error'
        default:
          return 'primary'
      }
    },
    formattedDate () {
      return moment(this.record.date).format('DD/MM/YYYY')
    }
  },
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
      },
      showNoteInput: false,
      showTagsInput: false,
      showDateDialog: false,
      dateDialogValue: moment().format('YYYY-MM-DD')
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
    },
    cancelDateDialog () {
      this.showDateDialog = false
      this.dateDialogValue = this.record.date
    },
    submit () {
      console.log(this.record)
    }
  },
  async beforeRouteUpdate (to, from, next) {
    const { type } = to.query
    this.changeTitle(type)
    this.record.type = type.toUpperCase()
    this.record.categoryId = ''
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
