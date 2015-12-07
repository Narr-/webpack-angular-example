'use strict';

var port = process.env.PORT || 3000;

module.exports = {
  PORT: port,
  DB: 'mongodb://localhost:27017/todoDb'
};
