const jwt = require('jsonwebtoken')

function getuserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)

    return userId
  }

  throw new Error('not authenticated!')
}

module.exports = {
  getuserId
}