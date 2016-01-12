/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */

'use strict';

angular.module('todomvc')
  .factory('todoStorage', ($http, $injector) =>
    // Detect if an API backend is present. If so, return the API module, else
    // hand off the localStorage adapter
    $http.post('/api', {
      userId: localStorage.getItem('dbUserId')
    })
    .then((response) => {
        if (response.data && response.data.userId) {
          localStorage.setItem('dbUserId', response.data.userId);
        }
        return $injector.get('api');
      }, () =>
      $injector.get('localStorage')
    )
  )

.factory('api', ($resource, todoSocket) => {
  const store = {
    todos: [],

    api: $resource('/api/todos/:id', null, {
      update: {
        method: 'PUT'
      }
    }),

    clearCompleted() {
      const originalTodos = store.todos.slice(0);

      const incompleteTodos = store.todos.filter((todo) =>
        !todo.completed
      );

      angular.copy(incompleteTodos, store.todos);

      return store.api.delete(function success() {
        const userId = localStorage.getItem('dbUserId');
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

    delete(todo) {
      const originalTodos = store.todos.slice(0);

      store.todos.splice(store.todos.indexOf(todo), 1);
      return store.api.delete({
          id: todo._id
        },
        function sucess() {
          const userId = localStorage.getItem('dbUserId');
          if (userId) {
            todoSocket.emit('dbChange', { // socket emits here cos can't add postData(payload) to DELETE Method
              message: 'Data deleted',
              dataObj: {
                userId
              }
            });
          }
        },
        function error() {
          angular.copy(originalTodos, store.todos);
        });
    },

    get() {
      return store.api.query((resp) => {
        angular.copy(resp, store.todos);
      });
    },

    insert(todo) {
      const originalTodos = store.todos.slice(0);
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

    put(todo) {
      todo.socketId = todoSocket.id;
      return store.api.update({
          id: todo._id
        }, todo)
        .$promise;
    }
  };

  todoSocket.on('connect', (data) => {
    const userId = localStorage.getItem('dbUserId');
    if (userId) {
      todoSocket.emit('join', {
        message: 'join the userId\'s room',
        dataObj: {
          userId: userId
        }
      });
    }
  });

  todoSocket.on('dbChange', (data) => {
    if (!WEBPACK_VAR.mode.production) {
      console.log('from socket %O', data);
    }
    if (todoSocket.id !== data.senderId) {
      store.get();
    }
  });

  return store;
})

.factory('localStorage', ($q) => {
  const STORAGE_ID = 'todos-angularjs';

  const store = {
    todos: [],

    _getFromLocalStorage() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    },

    _saveToLocalStorage(todos) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    },

    clearCompleted() {
      const deferred = $q.defer();
      const incompleteTodos = store.todos.filter((todo) =>
        !todo.completed
      );
      angular.copy(incompleteTodos, store.todos);
      store._saveToLocalStorage(store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    delete(todo) {
      const deferred = $q.defer();
      store.todos.splice(store.todos.indexOf(todo), 1);
      store._saveToLocalStorage(store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    get() {
      const deferred = $q.defer();
      angular.copy(store._getFromLocalStorage(), store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    insert(todo) {
      const deferred = $q.defer();
      store.todos.push(todo);
      store._saveToLocalStorage(store.todos);
      deferred.resolve(store.todos);
      return deferred.promise;
    },

    put(todo, index) {
      const deferred = $q.defer();
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
