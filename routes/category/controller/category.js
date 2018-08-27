const log = console.log;
const chalk = require('chalk');
const axios = require('axios');
const Boom = require('boom');

const web3 = require('../../config');
const certNetworkABI = require('../../utils/cert-network.abi.json');
const contractAddress = process.env.CONTRACT_ADDRESS;
const uuidv4 = require('uuid/v4');
const firebase = require('../../firebase');

const certNetworkContract = new web3.eth.Contract(
  certNetworkABI,
  contractAddress
);

module.exports = {
  get: async request => {
    try {
      const categoryRef = firebase.ref('category').limitToLast(100);
      const dataList = [];

      await categoryRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          const data = {
            id: childKey,
            name: childData.name
          };
          dataList.push(data);
        });
      });
      return {
        statusCode: 200,
        data: dataList
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  },
  add: async request => {
    try {
      const { name } = request.payload;
      firebase.ref('category/' + uuidv4()).set({
        name: name
      });
      return {
        statusCode: 201,
        message: 'Add Success'
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  }
};
