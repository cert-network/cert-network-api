const log = console.log;
const chalk = require('chalk');
const axios = require('axios');
const Boom = require('boom');

const web3 = require('../../config');
const certNetworkABI = require('../../utils/cert-network.abi.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

const certNetworkContract = new web3.eth.Contract(
  certNetworkABI,
  contractAddress
);

const account = require('../../utils/account');

module.exports = {
  add: async request => {
    try {
      const private = 'YOUR_PRIVATE_KEY_ADMIN';
      const adminAddress = 'YOU_ADMIN_ADDRESS';
      const { name, category, address } = request.payload;

      const nonce = await account.getNonce(adminAddress);

      const data = await certNetworkContract.methods
        .addAprrover(name, address, category)
        .encodeABI();
      const result = await account.signTrx(data, private, nonce);
      return {
        statusCode: 200,
        message: 'Add a new approver success'
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  },
  get: async request => {
    try {
      const { address } = request.params.address;
      const data = await certNetworkContract.methods
        .approverList(address)
        .call();
      return {
        statusCode: 200,
        data: {
          name: data.name,
          category: data.approvableIndustry
        }
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  }
};
