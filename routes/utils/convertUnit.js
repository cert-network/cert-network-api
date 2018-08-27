const web3 = require('../config')

module.exports = {
  fromWei: (number, unit) => {
    return web3.utils.fromWei(number, unit)
  },
  toWei: (number, unit) => {
    return web3.utils.toWei(number, unit)
  }
}
