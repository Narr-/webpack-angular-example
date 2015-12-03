'use strict';

describe('TodoCtrl', function() {

  var $scope, $controller;

  // angular.mock.module instead of module ==> http://stackoverflow.com/questions/32499108/karma-jasmine-webpack-module-is-not-a-function
  beforeEach(angular.mock.module('todomvc', function($provide) {
    var store = {
      todos: []
    };
    $provide.value('store', store);
  }));

  beforeEach(inject(function(_$rootScope_, _$controller_) {
    $scope = _$rootScope_.$new();
    $controller = _$controller_;
  }));

  describe('todos', function() {
    it('should return Array', function() {
      var controller;
      controller = $controller('TodoCtrl', {
        $scope: $scope
      });
      expect(angular.isArray(controller.todos)).toBeTruthy();
    });
  });
});
