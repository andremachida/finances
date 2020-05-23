import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import apollo from '../../../../../plugins/apollo'

import CategoriesQuery from '../graphql/Categories.gql'
import CategoryCreateMutation from '../graphql/CategoryCreate.gql'

const categories = ({ operation }) => {
  const queryref = apollo.watchQuery({
    query: CategoriesQuery,
    variables: { operation: operation ? operation.toUpperCase() : operation }
  })
  return from(queryref)
    .pipe(
      map(response => response.data.categories)
    )
}

const createCategory = async variables => {
  const response = await apollo.mutate({
    mutation: CategoryCreateMutation,
    variables,
    update: (proxy, { data: { createCategory } }) => {
      try {
        const variables = { operation: createCategory.operation }
        const data = proxy.readQuery({
          query: CategoriesQuery,
          variables
        })
        data.categories = [...data.categories, createCategory]

        proxy.writeQuery({
          query: CategoriesQuery,
          variables,
          data
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
  return response.data.createCategory
}

export default {
  categories,
  createCategory
}
