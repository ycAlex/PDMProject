'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Comment title',
    trim: true
  },
  submissions: [{
    type: Schema.ObjectId,
    ref: 'Submissions'
  }],
  improvements: [{
    type: Schema.ObjectId,
    ref: 'Improvements'
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

mongoose.model('Comment', CommentSchema);
