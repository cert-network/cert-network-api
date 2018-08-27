const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(
  `${process.env.INFURA_API}/v3/c320c6ba4199497d80efa8256094eff8`
);
const web3 = new Web3(provider);

module.exports = web3;
