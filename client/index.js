'use strict';

module.exports = angular.module('todomvc', ['ngResource', 'ngRoute'])
  .config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: true, // find "Server side" in https://docs.angularjs.org/guide/$location
      rewriteLinks: true
    });

    var routeConfig = {
      // reloadOnSearch: false, // If set this option to false, then the page won’t reload the route
      // if the search part(?aa=11&bb=22) of the URL changes.
      controller: 'TodoCtrl',
      controllerAs: 'todoVm',
      templateUrl: 'partials/todo/todo.html',
      resolve: {
        // Dependency Annotation for Uglify => ng-annotate loader doesn't handle this by default so add @ngInject
        // https://github.com/olov/ng-annotate#nginject-examples
        store: /*@ngInject*/ function(todoStorage) { // If any of these dependencies are promises,
          // the router will wait for them all to be resolved or one to be rejected before the controller
          // is instantiated.

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
