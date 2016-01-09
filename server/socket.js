'use strict';

var logger = require('./util/logger')(module);
var instance = null;

module.exports = function(server) {
  if (instance === null) {
    var io = require('socket.io').listen(server);
    instance = io;

    if (!process.env.TRAVIS) {
      var config = require('./config');
      var redis = require('redis');
      // when socket.io-redis connects to url with protocol(redis), it causes an error so using pubClient, subClient
      var redisSocket = require('socket.io-redis');
      io.adapter(redisSocket({ // http://socket.io/docs/using-multiple-nodes/#using-node.js-cluster
        pubClient: redis.createClient(config.REDIS_URL),
        subClient: redis.createClient(config.REDIS_URL, {
          return_buffers: true // https://github.com/socketio/socket.io-redis/issues/17
        })
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
