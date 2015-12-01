'use strict';

function LoadJSON() {
  this.load = function($http) {
    return $http.get(WEBPACK_VAR.labelJsonPath);
  };
}

module.exports = LoadJSON;
