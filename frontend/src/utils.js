import colors from 'vuetify/es5/util/colors'

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

const groupBy = (array, key, makeCurrentKey) => {
  return array.reduce((accumulated, item) => {
    const currentKey = makeCurrentKey(item, key)

    return {
      ...accumulated,
      [currentKey]: [
        ...(accumulated[currentKey] || []),
        item
      ]
    }
  }, {})
}

const registerVuexModule = (rootStore, moduleName, store) => {
  if (!(moduleName in rootStore._modules.root._children)) {
    rootStore.registerModule(moduleName, store)
  }
}

const idx = (object, keyPath) => {
  const keys = keyPath.split('.')
  return keys.reduce((object, current) => object && object[current] !== undefined ? object[current] : null, object)
}

const generateChartData = ({ items, keyToGroup, keyOfValue, aliases, type, backgroundColors }) => {
  const grouped = groupBy(items, keyToGroup, idx)
  const response = {}

  for (const key in grouped) {
    response[(aliases && aliases[key]) || key] = grouped[key].reduce((accumulated, item) => accumulated + item[keyOfValue], 0)
  }
  const labels = Object.keys(response)

  switch (type) {
    case 'bar':
      return {
        datasets: labels.map((label, index) => ({
          label: `${label}: ${currencyFormatter().format(response[label])}`,
          data: [response[label] >= 0 ? response[label] : -response[label]],
          backgroundColor: backgroundColors[index],
          borderWidth: 0
        }))
      }
    case 'doughnut':
      return {
        datasets: [{
          data: labels.map(label => response[label] >= 0 ? response[label] : -response[label]),
          backgroundColor: backgroundColors || generateColors(labels.length),
          borderWidth: 0
        }],
        labels: items.length > 0 ? labels : []
      }
  }
}

const generateChartOptions = (type) => {
  let tooltips = {}
  switch (type) {
    case 'bar':
      tooltips = {
        callbacks: {
          title () {},
          label (tooltip, data) {
            return data.datasets[tooltip.datasetIndex].label
          }
        }
      }
      break

    case 'doughnut':
      tooltips = {
        callbacks: {
          label (tooltip, data) {
            const label = data.labels[tooltip.index]
            const value = currencyFormatter().format(data.datasets[tooltip.datasetIndex].data[tooltip.index])

            return `${label}: ${value}`
          }
        }
      }
      break
  }
  const scales = {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  }

  return {
    scales,
    tooltips
  }
}

const generateChartConfigs = (opt) => {
  const { type } = opt
  const data = generateChartData(opt)
  const options = generateChartOptions(type)

  return {
    type,
    data,
    options
  }
}

const generateColors = (length) => {
  const palletes = Object.keys(colors).filter(pallete => pallete !== 'shades').sort()
  const tones = [
    'base',
    'darken1',
    'darken2',
    'darken3',
    'darken4',
    'lighten1',
    'lighten2',
    'lighten3',
    'lighten4',
    'lighten5'
  ]
  let currentPallete = 0
  let currentTone = 0

  return Array(length).fill().map((item, index) => {
    const color = colors[palletes[currentPallete]][tones[currentTone]]
    currentPallete++
    if ((index + 1) % palletes.length === 0) {
      currentPallete = 0
      currentTone++
    }
    return color
  })
}

generateColors(10)

export {
  formatError,
  errorHandler,
  currencyFormatter,
  groupBy,
  registerVuexModule,
  generateChartConfigs
}
