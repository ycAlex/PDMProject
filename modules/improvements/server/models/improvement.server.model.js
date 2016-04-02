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
  name: {
    type: String,
    default: '',
    required: 'Please fill Improvement name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Improvement', ImprovementSchema);
