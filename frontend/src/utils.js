const formatError = message => {
  const messageSplit = message.split(':')
  return messageSplit[messageSplit.length - 1].trim()
}

const errorHandler = (error, vm, info) => {
  const jwtErrors = ['jwt malformed', 'jwt expired', 'jwt not active', 'invalid token']
  if (jwtErrors.some(jwtError => error.message.includes(jwtError))) {
    vm.$router.push({
      path: '/login',
      query: { redirect: vm.$route.path }
    })
  }
}

const currencyFormatter = ({ locale, currency } = { locale: 'pt-BR', currency: 'BRL' }) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  })
}

export {
  formatError,
  errorHandler,
  currencyFormatter
}
