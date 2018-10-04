const log = console.log
const chalk = require('chalk')
const axios = require('axios')
const Boom = require('boom')

const web3 = require('../../config')
const certNetworkABI = require('../../utils/cert-network.abi.json')
const contractAddress = process.env.CONTRACT_ADDRESS

const account = require('../../utils/account')

const certNetworkContract = new web3.eth.Contract(
  certNetworkABI,
  contractAddress
)

module.exports = {
  get: async request => {
    try {
      const data = await certNetworkContract.methods.userList().call()
      log(chalk.magenta(JSON.stringify(data)))
      return {
        statusCode: 200,
        message: 'add a new user success'
      }
    } catch (error) {
      log(chalk.magenta(error))
      return Boom.badImplementation()
    }
  },
  add: async request => {
    try {
      const { name, passport, private, address } = request.payload

      const nonce = await account.getNonce(address)

      const data = await certNetworkContract.methods
        .createUser(name, passport)
        .encodeABI()
      const result = await account.signTrx(data, private, nonce)
      log(chalk.magenta(JSON.stringify(result)))
      return {
        statusCode: 200,
        message: 'add a new user success'
      }
    } catch (error) {
      log(chalk.magenta(error))
      return Boom.badImplementation()
    }
  }
}
