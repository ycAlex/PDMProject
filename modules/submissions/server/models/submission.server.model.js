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
    default: '',
    trim: true
  },

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
