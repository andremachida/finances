const { getuserId } = require('./../utils')

function user(_, args, context, info) {
  const userId = getuserId(context)
  return context.db.query.user({ where: { id: userId }}, info)
}

module.exports = {
  user
}