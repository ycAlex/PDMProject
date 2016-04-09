'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Submission Schema
 * Each submission must be tied to a user
 */
var SubmissionSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Submission name',
    trim: true
  },
  body: {
    type: String,
    default: '',
    required: 'Please add some text to your submission',
    trim: true
  },
  categories: {
    type: String,
    enum: ['General', 'Aboriginal Studies', 'Business School', 'Health Sciences',
      'Humanities', 'Science and Engineering'],
    required: 'Please include a catagory with your submission',
    trim: true
  },

  improvements: [{
    type: Schema.ObjectId,
    ref: 'Improvements'
  }],

  comments: [{
    type: Schema.ObjectId,
    ref: 'UserComments'
  }],

  likes: Number,

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Submission', SubmissionSchema);
