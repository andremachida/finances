const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const moment = require('moment')
const { getuserId } = require('./../utils')

const JWT_SECRET = process.env.JWT_SECRET

async function login(_, { email, password }, context, info) {
  const user = await context.db.query.user({ where: { email }})
  if (!user) {
    throw new Error('Email not found!')
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Invalid password!')
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' })

  return {
    token,
    user
  }
}

async function signup(_, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.db.mutation.createUser({ data: { ...args, password }})
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' })

  return {
    token,
    user
  }
}

function createAccount(_, { description }, context, info) {
  const userId = getuserId(context)
  return context.db.mutation.createAccount({
    data: {
      description,
      user: {
        connect: {
          id: userId
        }
      }
    }
  }, info)
}

function createCategory(_, { description, operation }, context, info) {
  const userId = getuserId(context)

  return context.db.mutation.createCategory({
    data: {
      description,
      operation,
      user: {
        connect: {
          id: userId
        }
      }
    }
  }, info)
}

function createRecord(_, args, context, info) {
  const date = moment(args.date)
  if (!date.isValid()) {
    throw new Error('Invalid Date!')
  }

  let { amount, type } = args
  if ((type === 'DEBIT' && amount > 0) || (type === 'CREDIT' && amount < 0))  {
    amount = -amount
  }
  
  const userId = getuserId(context)

  return context.db.mutation.createRecord({
    data: {
      user: {
        connect: { id: userId }
      },
      account: {
        connect: { id: args.accountId }
      },
      category: {
        connect: { id: args.categoryId }
      },
      amount,
      type,
      date: args.date,
      description: args.description,
      tags: args.tags,
      note: args.note,
    }
  }, info)
}

module.exports = {
  login,
  signup,
  createAccount,
  createCategory,
  createRecord
}