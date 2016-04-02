'use strict';

/**
 * Module dependencies
 */
var improvementsPolicy = require('../policies/improvements.server.policy'),
  improvements = require('../controllers/improvements.server.controller');

module.exports = function(app) {
  // Improvements Routes
  app.route('/api/improvements').all(improvementsPolicy.isAllowed)
    .get(improvements.list)
    .post(improvements.create);

  app.route('/api/improvements/:improvementId').all(improvementsPolicy.isAllowed)
    .get(improvements.read)
    .put(improvements.update)
    .delete(improvements.delete);

  // Finish by binding the Improvement middleware
  app.param('improvementId', improvements.improvementByID);
};
