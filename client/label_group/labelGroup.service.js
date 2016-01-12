'use strict';

class LabelGroup {
  constructor($http) {
    this.$http = $http;
    this.isCalled = false;
    this.html = '';
    this.loadHtml = null;
  }

  setHtml() {
    this.loadHtml.load(this.$http).then((response) => {
      let str = '';
      response.data.records.map((record) => {
        str += record.html;
      });
      this.html = str;
    });
  }
}

angular.module('todomvc')
  .service('labelGroup', LabelGroup);
