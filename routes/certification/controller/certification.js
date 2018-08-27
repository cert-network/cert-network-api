const log = console.log;
const chalk = require('chalk');
const axios = require('axios');
const Boom = require('boom');

const web3 = require('../../config');
const certNetworkABI = require('../../utils/cert-network.abi.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

const account = require('../../utils/account');
const moment = require('moment');

const certNetworkContract = new web3.eth.Contract(
  certNetworkABI,
  contractAddress
);

module.exports = {
  get: async request => {
    try {
      const { address } = request.params;
      let certificationList = [];
      let isNext = true;
      let index = 0;
      try {
        while (isNext) {
          let data = await certNetworkContract.methods
            .certificateList(index)
            .call();

          if (
            data.id ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            isNext = false;
          } else {
            index++;
            certificationList.push(data);
          }
        }
      } catch (error) {}

      const filterCertByCertCreator = certificationList.filter(
        cert => cert.certCreator === address
      );

      const mappingCert = filterCertByCertCreator.map(cert => {
        const {
          id,
          certCreator,
          certName,
          certIndustry,
          certDescription,
          issuedDate,
          expiredDate,
          approvedBy,
          isApproved
        } = cert;
        return {
          certId: id,
          certCreator: certCreator,
          certName: certName,
          category: certIndustry,
          desc: certDescription,
          issueDate: issuedDate,
          expiredDate: expiredDate,
          approveBy: approvedBy,
          isApprove: isApproved
        };
      });
      return {
        statusCode: 200,
        data: mappingCert
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  },
  getByApproverAddress: async request => {
    try {
      const { address } = request.params;
      let index = 0;
      let certificationList = [];
      let isNext = true;
      try {
        while (isNext) {
          let data = await certNetworkContract.methods
            .certificateList(index)
            .call();

          if (
            data.id ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            isNext = false;
          } else {
            index++;
            certificationList.push(data);
          }
        }
      } catch (error) {}

      const approverData = await certNetworkContract.methods
        .approverList(address)
        .call();

      const filerData = certificationList.filter(
        cert => cert.certIndustry === approverData.approvableIndustry
      );

      const filterResult = filerData.filter(cert => cert.isApproved === false);

      const certCreatiorNameList = await Promise.all(
        filterResult.map(cert => {
          return certNetworkContract.methods.userList(cert.certCreator).call();
        })
      );

      for (const [index, value] of filterResult.entries()) {
        filterResult[index].certCreatorName = certCreatiorNameList[index].name;
      }

      const filerDataMap = filterResult.map(cert => {
        const {
          id,
          certCreator,
          certName,
          certIndustry,
          certDescription,
          issuedDate,
          expiredDate,
          approvedBy,
          isApproved,
          certCreatorName
        } = cert;
        return {
          certId: id,
          certCreator: certCreator,
          certCreatorName: certCreatorName,
          certName: certName,
          category: certIndustry,
          desc: certDescription,
          issueDate: issuedDate,
          expiredDate: expiredDate,
          approveBy: approvedBy,
          isApprove: isApproved
        };
      });
      return {
        statusCode: 200,
        data: filerDataMap
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.notFound();
    }
  },
  add: async request => {
    const {
      name,
      category,
      desc,
      expiredDate,
      private,
      address
    } = request.payload;
    try {
      const nonce = await account.getNonce(address);

      const encodeContract = await certNetworkContract.methods
        .createCertificate(name, category, desc, expiredDate)
        .encodeABI();

      const result = await account.signTrx(encodeContract, private, nonce);
      log(chalk.magenta(JSON.stringify(result)));
      return {
        statusCode: 201,
        message: 'Create Certification Success'
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  },
  approve: async request => {
    try {
      const isApprove = true;
      const {
        certId,
        certCreator,
        address,
        private,
        category
      } = request.payload;
      const issueDate = moment().format('DD/MM/YYYY');
      const nonce = await account.getNonce(address);
      const encodeContract = await certNetworkContract.methods
        .verifyCertificate(certCreator, certId, issueDate, category, isApprove)
        .encodeABI();
      const result = await account.signTrx(encodeContract, private, nonce);
      log(chalk.magenta(JSON.stringify('approve address', result)));
      return {
        statusCode: 200,
        message: 'Approve Success'
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  },
  reject: async request => {
    try {
      const isApprove = false;
      const {
        certId,
        certCreator,
        address,
        private,
        category
      } = request.payload;
      const nonce = await account.getNonce(address);
      const issueDate = moment().format('DD/MM/YYYY');
      const encodeContract = await certNetworkContract.methods
        .verifyCertificate(certCreator, certId, issueDate, category, isApprove)
        .encodeABI();
      const result = await account.signTrx(encodeContract, private, nonce);
      log(chalk.magenta(result));
      return {
        statusCode: 200,
        message: 'Reject Success'
      };
    } catch (error) {
      log(chalk.magenta(error));
      return Boom.badImplementation();
    }
  }
};
