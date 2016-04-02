'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Usercomment = mongoose.model('Usercomment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Usercomment
 */
exports.create = function(req, res) {
  var usercomment = new Usercomment(req.body);
  usercomment.user = req.user;

  usercomment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usercomment);
    }
  });
};

/**
 * Show the current Usercomment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var usercomment = req.usercomment ? req.usercomment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  usercomment.isCurrentUserOwner = req.user && usercomment.user && usercomment.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(usercomment);
};

/**
 * Update a Usercomment
 */
exports.update = function(req, res) {
  var usercomment = req.usercomment ;

  usercomment = _.extend(usercomment , req.body);

  usercomment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usercomment);
    }
  });
};

/**
 * Delete an Usercomment
 */
exports.delete = function(req, res) {
  var usercomment = req.usercomment ;

  usercomment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usercomment);
    }
  });
};

/**
 * List of Usercomments
 */
exports.list = function(req, res) { 
  Usercomment.find().sort('-created').populate('user', 'displayName').exec(function(err, usercomments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(usercomments);
    }
  });
};

/**
 * Usercomment middleware
 */
exports.usercommentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Usercomment is invalid'
    });
  }

  Usercomment.findById(id).populate('user', 'displayName').exec(function (err, usercomment) {
    if (err) {
      return next(err);
    } else if (!usercomment) {
      return res.status(404).send({
        message: 'No Usercomment with that identifier has been found'
      });
    }
    req.usercomment = usercomment;
    next();
  });
};
