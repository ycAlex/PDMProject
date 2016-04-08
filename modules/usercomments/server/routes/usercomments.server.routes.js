'use strict';

/**
 * Module dependencies
 */
var usercommentsPolicy = require('../policies/usercomments.server.policy'),
  usercomments = require('../controllers/usercomments.server.controller');

module.exports = function(app) {
  // Usercomments Routes
  app.route('/api/usercomments').all(usercommentsPolicy.isAllowed)
    .get(usercomments.list)
    .post(usercomments.create);

  app.route('/api/usercomments/:usercommentId').all(usercommentsPolicy.isAllowed)
    .get(usercomments.read)
    .put(usercomments.update)
    .delete(usercomments.delete);

  // Finish by binding the Usercomment middleware
  app.param('usercommentId', usercomments.usercommentByID);
};
