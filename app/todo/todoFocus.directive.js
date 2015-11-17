/**
 * Directive that places focus on the element it is applied to when the
 * expression it binds to evaluates to true
 */

'use strict';

angular.module('todomvc')
  .directive('todoFocus', function todoFocus($timeout) {

    return function(scope, elem, attrs) {
      scope.$watch(attrs.todoFocus, function(newVal) {
        if (newVal) {
          // For a delay which can give some time to input to be visible before
          // it gets focused so that it won't miss the focus.
          $timeout(function() {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  });
