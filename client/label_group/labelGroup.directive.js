'use strict';

angular.module('todomvc')
  .directive('labelGroup', function($compile, labelGroup) {

    var link = function(scope, element, attrs) {
      // labelGroup.setScope(scope);

      scope.$watch(function() {
        return labelGroup.html;
      }, function(newValue) {
        // console.log(newValue);

        element.html(newValue);
        $compile(element.contents())(scope);
      }, true);
    };

    return {
      link: link
    };
  });
