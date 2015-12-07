'use strict';

var mongoose = require('mongoose');
// create schema
var todoSchema = new mongoose.Schema({
  'title': {
    type: String,
    required: false
  },
  'completed': {
    type: Boolean,
    required: true
  }
});
// create model if not exists.
module.exports = mongoose.model('todo', todoSchema);
