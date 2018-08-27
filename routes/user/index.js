const CategoryController = require('./controller/user');
const Joi = require('joi');

module.exports = {
  name: 'userAPI',
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/user',
        handler: CategoryController.get,
        config: {
          auth: false
        }
      },
      {
        method: 'POST',
        path: '/user',
        handler: CategoryController.add,
        config: {
          auth: false
        }
      }
    ]);
  }
};
