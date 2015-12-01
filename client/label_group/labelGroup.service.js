'use strict';

function LabelGroup($http) {
  var lg = this;
  // var sc;

  lg.isCalled = false;
  lg.html = '';
  lg.loadHtml = null;

  // lg.setScope = function(scope) {
  //   sc = scope;
  // };

  lg.setHtml = function() {
    lg.loadHtml.load($http).then(function(response) {
      var str = '';
      angular.forEach(response.data.records, function(value, key) {
        str += value.html;
      });
      lg.html = str;

      // sc.$digest();
    });
  };
}

angular.module('todomvc')
  .service('labelGroup', LabelGroup);
