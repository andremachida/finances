const moment = require('moment')
const { getuserId } = require('./../utils')

function user(_, args, context, info) {
  const userId = getuserId(context)
  return context.db.query.user({ where: { id: userId }}, info)
}

function accounts(_, args, context, info) {
  const userId = getuserId(context)
  return context.db.query.accounts({
    where: {
      OR: [
        {
          user: {
            id: userId
          }
        },
        {
          user: null
        }
      ]
    },
    orderBy: 'description_ASC'
  }, info)
}

function categories(_, { operation }, context, info) {
  const userId = getuserId(context)

  let AND = [
    {
      OR: [
        {
          user: {
            id: userId
          }
        },
        {
          user: null
        }
      ]
    }
  ]

  AND = !operation ? AND : [ ...AND, { operation } ]

  return context.db.query.categories({
    where: { AND },
    orderBy: 'description_ASC'
  }, info)
}

function records(_, { type, accountsIds, categoriesIds, month }, context, info) {
  const userId = getuserId(context)

  let AND = [ { user: { id: userId } } ]
  AND = !type ? AND : [ ...AND, { type } ]
  AND = !accountsIds || accountsIds.length === 0
    ? AND : [ ...AND, { OR: accountsIds.map(id => ({ account: { id } })) } ]
  AND = !categoriesIds || categoriesIds.length === 0
    ? AND : [ ...AND, { OR: categoriesIds.map(id => ({ category: { id } })) } ]

  if (month) {
    const date = moment(month, 'MM-YYYY')
    const startDate = date.startOf('month').toISOString()
    const endDate = date.endOf('month').toISOString()

    AND = [
      ...AND,
      { date_gte: startDate },
      { date_lte: endDate }
    ]
  }

  return context.db.query.records({
    where: { AND },
    orderBy: 'date_ASC'
  }, info)
}

module.exports = {
  user,
  accounts,
  categories,
  records
}