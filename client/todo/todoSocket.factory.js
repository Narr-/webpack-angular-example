'use strict';

angular.module('todomvc')
  .factory('todoSocket', function() {
    return io({ // io: required(socket.io-client) by webpack.ProvidePlugin
      // for node clusetering, ref: http://stackoverflow.com/questions/26217312/socket-io-and-multiple-dynos-on-heroku-node-js-app-websocket-is-closed-before
      transports: ['websocket']
    });
  });
