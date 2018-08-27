const CategoryController = require('./controller/category');
const Joi = require('joi');

module.exports = {
  name: 'categoryAPI',
  register: async (server, options) => {
    server.route([
      {
        method: 'GET',
        path: '/category',
        handler: CategoryController.get,
        config: {
          auth: false
        }
      },
      {
        method: 'POST',
        path: '/category',
        handler: CategoryController.add,
        config: {
          description: '(batch) create static cryptoType',
          auth: false,
          tags: ['api', 'category']
        }
      }
    ]);
  }
};
