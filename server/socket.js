'use strict';

var logger = require('./util/logger')(module);
var instance = null;

module.exports = function(server) {
  if (instance === null) {
    var io = require('socket.io').listen(server);
    instance = io;

    var config = require('./config');
    // when socket.io-redis connects to url with protocol(redis), it causes an error so exclude the protocol
    // and divide it to host and port
    var redisUrl = config.REDIS_URL.match(/redis:\/\/.*?@(.*?):([0-9]*?$)/);
    if (redisUrl) {
      var redisSocket = require('socket.io-redis');
      var redis = require('redis');
      io.adapter(redisSocket({ // http://socket.io/docs/using-multiple-nodes/#using-node.js-cluster
        pubClient: redis.createClient(config.REDIS_URL),
        subClient: redis.createClient(config.REDIS_URL)
      }));
    }

    // http://stackoverflow.com/questions/26217312/socket-io-and-multiple-dynos-on-heroku-node-js-app-websocket-is-closed-before
    io.set('transports', ['websocket']);

    io.on('connection', function(socket) {
      logger.info('socket id: ' + socket.id + ' is connected..!!');

      socket.on('join', function(data) {
        socket.join(data.dataObj.userId, function(err) {
          logger.info('socket id: ' + socket.id + ' has joined to room, ' + data.dataObj.userId +
            '..!!');
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
