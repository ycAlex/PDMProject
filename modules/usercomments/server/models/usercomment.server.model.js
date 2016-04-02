'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Usercomment Schema
 */
var UsercommentSchema = new Schema({
  body: {
    type: String,
    default: '',
    required: 'Please fill Comment name',
    trim: true
  },
  submissions: [{
    type: Schema.ObjectId,
    ref: 'Submission'
  }],
  improvements: [{
    type: Schema.ObjectId,
    ref: 'Improvement'
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  likes: Number
});

mongoose.model('Usercomment', UsercommentSchema);
