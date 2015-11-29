'use strict';

module.exports = angular.module('todomvc', ['ngResource', 'ngRoute'])
  .config(function($routeProvider) {
    var routeConfig = {
      controller: 'TodoCtrl',
      controllerAs: 'todoVm',
      templateUrl: 'partials/todo/todo.html',
      resolve: {
        // Dependency Annotation for Uglify => ng-annotate loader doesn't handle this by default so add @ngInject
        // https://github.com/olov/ng-annotate#nginject-examples
        store: /*@ngInject*/ function(todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function(module) {
            module.get(); // Fetch the todo records in the background
            return module;
          });
        }
      }
    };

    $routeProvider
      .when('/', routeConfig)
      .when('/:status', routeConfig)
      .otherwise({
        redirectTo: '/'
      });
  });
