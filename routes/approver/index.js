const ApproverController = require('./controller/approver');
const Joi = require('joi');

module.exports = {
  name: 'approverAPI',
  register: async (server, options) => {
    server.route([
      {
        method: 'POST',
        path: '/approver',
        handler: ApproverController.add,
        config: {
          auth: false
        }
      },
      {
        method: 'GET',
        path: '/approver/{address}',
        handler: ApproverController.get,
        config: {
          auth: false
        }
      }
    ]);
  }
};
