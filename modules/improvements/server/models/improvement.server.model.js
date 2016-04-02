'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Improvement Schema
 */
var ImprovementSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Improvement title',
    trim: true
  },
  body: {
    type: String,
    default: '',
    required: 'Please fill Improvement body',
    trim: true
  },
  submissions: [{
    type: Schema.ObjectId,
    ref: 'Submissions',
    required: true
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

mongoose.model('Improvement', ImprovementSchema);
