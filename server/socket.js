'use strict';

var logger = require('./util/logger')(module);
var instance = null;

module.exports = function(app) {
  if (instance === null) {
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    instance = io;
    io.on('connection', function(socket) {
      logger.info('socket id: ' + socket.id + ' is connected..!!');

      socket.on('dbChange', function(data) {
        logger.info(data);
        socket.broadcast.emit('dbChange', data);
      });
    });
    return {
      server: server,
      io: io
    };
  } else {
    return instance;
  }
};
