require('dotenv').config()

const log = console.log
const Boom = require('boom')
const Hapi = require('hapi')
const HapiJWT = require('hapi-auth-jwt2')
const chalk = require('chalk')

const Inert = require('inert')
const Vision = require('vision')

const category = require('./routes/category')
const certification = require('./routes/certification')
const user = require('./routes/user')
const approver = require('./routes/approver')

const routes = [category, certification, user, approver]
const plugins = [HapiJWT, Inert, Vision, ...routes]
const server = Hapi.server({
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 8000,
  routes: {
    cors: {
      credentials: false
    }
  }
})

async function start() {
  try {
    await server.register(plugins, {
      routes: {
        prefix: '/api'
      }
    })
    await server.start()
    log(
      'Hapi server running at :',
      chalk.yellow(server.info.uri),
      `[${chalk.cyan(process.env.ENVIRONMENT)}]`
    )
  } catch (err) {
    log(err)
    process.exit(1)
    return Boom.badImplementation()
  }
}
start()
