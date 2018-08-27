const log = console.log;
const chalk = require('chalk');
const contractAddress = process.env.CONTRACT_ADDRESS;
const web3 = require('../config');
const { fromWei, toWei } = require('../utils/convertUnit');

module.exports = {
  signTrx: async (encodeContract, privateKey, nonce) => {
    try {
      const signTrxResult = await web3.eth.accounts.signTransaction(
        {
          nonce: nonce,
          gasPrice: web3.utils.numberToHex(toWei('2', 'Gwei')),
          gasLimit: '5000000',
          to: contractAddress,
          value: 0,
          data: encodeContract
        },
        privateKey
      );

      const sendSignTrxRsult = await web3.eth.sendSignedTransaction(
        signTrxResult.rawTransaction
      );
      return sendSignTrxRsult;
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  },
  getNonce: async address => {
    try {
      const nonce = await web3.eth.getTransactionCount(address, 'pending');
      return nonce;
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  }
};
