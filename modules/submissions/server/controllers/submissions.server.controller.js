'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Submission = mongoose.model('Submission'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Submission
 */
exports.create = function(req, res) {
  var submission = new Submission(req.body);
  submission.user = req.user;

  submission.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(submission);
    }
  });
};

/**
 * Show the current Submission
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var submission = req.submission ? req.submission.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  submission.isCurrentUserOwner = req.user && submission.user && submission.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(submission);
};

/**
 * Update a Submission
 */
exports.update = function(req, res) {
  var submission = req.submission ;

  submission = _.extend(submission , req.body);

  submission.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(submission);
    }
  });
};

/**
 * Delete an Submission
 */
exports.delete = function(req, res) {
  var submission = req.submission ;

  submission.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(submission);
    }
  });
};

/*
 * List of Submissions
 *
exports.list = function(req, res) { 
  Submission.find().sort('-created').populate('user', 'displayName').exec(function(err, submissions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(submissions);
    }
  });
};*/

/**
 * List of Submissions by category
 *
exports.list = function(req, res) {
  Submission.find({'categories':'General'}).sort('-created').populate('user', 'displayName').exec(function(err, submissions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(submissions);
    }
  });
};*/

/**
 * List of Submissions by category
 */
exports.list = function(req, res) {
  Submission.find().sort('-created').populate('user', 'displayName').exec(function(err, submissions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(submissions);
    }
  });
};
exports.mylist = function(req, res) {
  Submission.find({ 'user': req.user.id }).sort('-created').populate('user', 'displayName').exec(function(err, submissions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(submissions);
    }
  });
};



/**
 * Submission middleware
 */
exports.submissionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Submission is invalid'
    });
  }

  Submission.findById(id).populate('user', 'displayName').exec(function (err, submission) {
    if (err) {
      return next(err);
    } else if (!submission) {
      return res.status(404).send({
        message: 'No Submission with that identifier has been found'
      });
    }
    req.submission = submission;
    next();
  });
};
