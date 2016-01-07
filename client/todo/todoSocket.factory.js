'use strict';

angular.module('todomvc')
  .factory('todoSocket', function() {
    return io({ // io: required(socket.io-client) by webpack.ProvidePlugin
      transports: ['websocket']
    });
  });
