/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */

'use strict';

angular.module('todomvc')
  .factory('todoStorage', function($http, $injector) {
    // Detect if an API backend is present. If so, return the API module, else
    // hand off the localStorage adapter
    return $http.post('/api', {
        userId: localStorage.getItem('dbUserId')
      })
      .then(function(response) {
        if (response.data && response.data.userId) {
          localStorage.setItem('dbUserId', response.data.userId);
        }
        return $injector.get('api');
      }, function() {
        return $injector.get('localStorage');
      });
  })

.factory('api', function($resource, todoSocket) {
  var store = {
    todos: [],

    api: $resource('/api/todos/:id', null, {
      update: {
        method: 'PUT'
      }
    }),

    clearCompleted: function() {
      var originalTodos = store.todos.slice(0);

      var incompleteTodos = store.todos.filter(function(todo) {
        return !todo.completed;
      });

      angular.copy(incompleteTodos, store.todos);

      return store.api.delete(function success() {
        var userId = localStorage.getItem('dbUserId');
        if (userId) {
          todoSocket.emit('dbChange', {
            message: 'Data deleted',
            dataObj: {
              userId: userId
            }
          });
        }
      }, function error() {
        angular.copy(originalTodos, store.todos);
      });
    },

    delete: function(todo) {
      var originalTodos = store.todos.slice(0);

      store.todos.splice(store.todos.indexOf(todo), 1);
      return store.api.delete({
          id: todo._id
        },
        function sucess() {
          var userId = localStorage.getItem('dbUserId');
          if (userId) {
            todoSocket.emit('dbChange', { // socket emits here cos can't add postData(payload) to DELETE Method
              message: 'Data deleted',
              dataObj: {
                userId: userId
              }
            });
          }
        },
        function error() {
          angular.copy(originalTodos, store.todos);
        });
    },

    get: function() {
      return store.api.query(function(resp) {
        angular.copy(resp, store.todos);
      });
    },

    insert: function(todo) {
      var originalTodos = store.todos.slice(0);
      todo.socketId = todoSocket.id;
      return store.api.save(todo,
          function success(resp) {
            todo._id = resp._id;
            store.todos.push(todo);
          },
          function error() {
            angular.copy(originalTodos, store.todos);
          })
        .$promise;
    },

    put: function(todo) {
      todo.socketId = todoSocket.id;
      return store.api.update({
          id: todo._id
        }, todo)
        .$promise;
    }
  };

  todoSocket.on('connect', function(data) {
    var userId = localStorage.getItem('dbUserId');
    if (userId) {
      todoSocket.emit('join', {
        message: 'join the userId\'s room',
        dataObj: {
          userId: userId
        }
      });
    }
  });

  todoSocket.on('dbChange', function(data) {
    if (!WEBPACK_VAR.mode.production) {
      console.log('from socket %O', data);
    }
    if (todoSocket.id !== data.senderId) {
      store.get();
    }
  });

  return store;
})

.factory('localStorage', function($q) {
  var STORAGE_ID = 'todos-angularjs';

  var store = {
    todos: [],

    _getFromLocalStorage: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },

    _saveToLocalStorage: function(todos) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    },

    clearCompleted: function() {
      var deferred = $q.defer();
      var incompleteTodos = store.todos.filter(function(todo) {
        return !todo.completed;
      });
      angular.copy(incompleteTodos, store.todos);
      store._saveToLocalStorage(store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    delete: function(todo) {
      var deferred = $q.defer();
      store.todos.splice(store.todos.indexOf(todo), 1);
      store._saveToLocalStorage(store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    get: function() {
      var deferred = $q.defer();
      angular.copy(store._getFromLocalStorage(), store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    insert: function(todo) {
      var deferred = $q.defer();
      store.todos.push(todo);
      store._saveToLocalStorage(store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    put: function(todo, index) {
      var deferred = $q.defer();
      if (index) {
        store.todos[index] = todo;
      }
      store._saveToLocalStorage(store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    }
  };

  return store;
});
