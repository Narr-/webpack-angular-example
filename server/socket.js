'use strict';

var logger = require('./util/logger')(module);
var instance = null;

module.exports = function(server) {
  if (instance === null) {
    var io = require('socket.io').listen(server);
    instance = io;
    // io.set('transports', ['websocket']);
    io.on('connection', function(socket) {
      logger.info('socket id: ' + socket.id + ' is connected..!!');

      socket.on('join', function(data) {
        socket.join(data.dataObj.userId, function(err) {
          logger.info('socket id: ' + socket.id + ' has joined to room, ' + data.dataObj.userId + '..!!');
          if (err) {
            logger.error(err);
          }
        });
      });

      socket.on('dbChange', function(data) {
        logger.info(data);
        socket.to(data.dataObj.userId).emit('dbChange', data);
      });
    });
  }
  return instance;
};
