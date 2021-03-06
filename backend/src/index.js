const { GraphQLServer } = require('graphql-yoga')
const Binding = require('prisma-binding')
require('dotenv').config()
const { prisma } = require('./generated/prisma-client')

const resolvers = require('./resolvers')

const env = process.env
const endpoint = `${env.PRISMA_ENDPOINT}/${env.PRISMA_SERVICE}/${env.PRISMA_STAGE}`

const server = new GraphQLServer({
  typeDefs: `${__dirname}/schema.graphql`,
  resolvers,
  context: (request) => ({
    ...request,
    db: new Binding.Prisma({
      typeDefs: `${__dirname}/generated/graphql-schema/prisma.graphql`,
      endpoint
    }),
    prisma
  })
})

server.start().then(() => console.log('server running on port 4000'))