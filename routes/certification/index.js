const CertificationController = require('./controller/certification');
const Joi = require('joi');

module.exports = {
  name: 'addressAPI',
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/cert/user/{address}',
        handler: CertificationController.get,
        config: {
          auth: false
        }
      },
      {
        method: 'GET',
        path: '/cert/approver/{address}',
        handler: CertificationController.getByApproverAddress,
        config: {
          auth: false
        }
      },
      {
        method: 'POST',
        path: '/cert',
        handler: CertificationController.add,
        config: {
          description: '(batch) create static cryptoType',
          auth: false,
          tags: ['api', 'address']
        }
      },
      {
        method: 'POST',
        path: '/cert/approve',
        handler: CertificationController.approve,
        config: {
          description: 'Add Certification',
          tags: ['api', 'certification']
        }
      },
      {
        method: 'POST',
        path: '/cert/reject',
        handler: CertificationController.reject,
        config: {
          description: 'Reject certification',
          tags: ['api', 'certification']
        }
      }
    ]);
  }
};
