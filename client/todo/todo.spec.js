'use strict';

describe('TodoCtrl', () => {

  let $scope, $controller;

  // angular.mock.module instead of module ==> http://stackoverflow.com/questions/32499108/karma-jasmine-webpack-module-is-not-a-function
  beforeEach(angular.mock.module('todomvc', ($provide) => {
    const store = {
      todos: []
    };
    $provide.value('store', store);
  }));

  beforeEach(inject((_$rootScope_, _$controller_) => {
    $scope = _$rootScope_.$new();
    $controller = _$controller_;
  }));

  describe('todos', () => {
    it('should return Array', () => {
      const controller = $controller('TodoCtrl', {
        $scope: $scope
      });
      expect(angular.isArray(controller.todos)).toBeTruthy();
    });
  });
});
