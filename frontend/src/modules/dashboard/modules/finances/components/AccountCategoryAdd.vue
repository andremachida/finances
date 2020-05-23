<template>
  <v-card>
    <v-card-title class="headline">{{ title }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="$v.item.description.$model"
        label="Description"></v-text-field>
      <v-select
        v-if="entity === 'category'"
        v-model="$v.item.operation.$model"
        label="Operation"
        :items="operations"
        item-text="description"
        item-value="value"></v-select>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text
        @click="$emit('close')">
        Cancel
      </v-btn>
      <v-btn text
        color="primary"
        :disabled="$v.$invalid"
        @click="save">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'

import AccountsService from '../services/accounts-service'
import CategoriesService from '../services/categories-service'

export default {
  name: 'AccountCategoryAdd',
  props: {
    entity: String
  },
  computed: {
    title () {
      return this.entity === 'account' ? 'New Account' : 'New Category'
    }
  },
  data () {
    return {
      item: {
        description: '',
        operation: this.$route.query.type.toUpperCase()
      },
      operations: [
        { description: 'Credit', value: 'CREDIT' },
        { description: 'Debit', value: 'DEBIT' }
      ]
    }
  },
  validations () {
    const validations = {
      item: {
        description: {
          required,
          minLength: minLength(3)
        }
      }
    }

    if (this.entity === 'account') {
      return validations
    }

    return {
      item: {
        ...validations.item,
        operation: { required }
      }
    }
  },
  methods: {
    async save () {
      let promise
      switch (this.entity) {
        case 'account':
          promise = AccountsService.createAccount(this.item)
          break
        case 'category':
          promise = CategoriesService.createCategory(this.item)
      }
      const item = await promise
      this.$emit('saved', item)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
