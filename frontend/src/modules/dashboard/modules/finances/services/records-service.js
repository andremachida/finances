import moment from 'moment'

import apollo from '../../../../../plugins/apollo'
import RecordsQuery from '../graphql/Records.gql'
import TotalBalanceQuery from '../graphql/TotalBalance.gql'
import RecordCreateQuery from '../graphql/RecordCreate.gql'

const records = async variables => {
  const response = await apollo.query({
    query: RecordsQuery,
    variables
  })

  return response.data.records
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
    variables
  })
  return response.data.createRecord
}

export default {
  records,
  totalBalance,
  createRecord
}
