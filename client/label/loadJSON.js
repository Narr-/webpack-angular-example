'use strict';

class LoadJSON {
  load($http) {
    return $http.get(WEBPACK_VAR.labelJsonPath);
  }
}

export default LoadJSON;
