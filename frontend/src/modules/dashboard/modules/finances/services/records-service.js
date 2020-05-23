import moment from 'moment'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import apollo from '../../../../../plugins/apollo'
import RecordsQuery from '../graphql/Records.gql'
import TotalBalanceQuery from '../graphql/TotalBalance.gql'
import RecordCreateQuery from '../graphql/RecordCreate.gql'

const records = variables => {
  const queryRef = apollo.watchQuery({
    query: RecordsQuery,
    variables
  })

  return from(queryRef).pipe(
    map(response => response.data.records)
  )
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  })

  return response.data.totalBalance
}

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateQuery,
    variables,
    update: (proxy, { data: { createRecord } }) => {
      const month = moment(createRecord.date).format('MM-YYYY')
      const variables = { month }

      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })

        recordsData.records = [
          ...recordsData.records,
          createRecord
        ]

        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
  return response.data.createRecord
}

export default {
  records,
  totalBalance,
  createRecord
}
