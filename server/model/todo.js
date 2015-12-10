'use strict';

var mongoose = require('mongoose');
// create schema
var todoSchema = new mongoose.Schema({
  'userId': {
    type: String,
    required: true
  },
  'userIp': {
    type: String,
    required: true
  },
  'title': {
    type: String,
    required: true
  },
  'completed': {
    type: Boolean,
    required: true
  }
});
// create model if not exists.
module.exports = mongoose.model('todo', todoSchema);
