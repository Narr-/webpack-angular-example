'use strict';

angular.module('todomvc')
  .directive('labelGroup', ($compile, labelGroup) => {

    const link = (scope, element, attrs) => {
      // labelGroup.setScope(scope);

      scope.$watch(() => labelGroup.html, (newValue, oldValue) => {
        // console.log(newValue);
        element.html(newValue);
        // $compile(element.contents())(scope);
      });
    };

    return {
      link: link
    };
  });
