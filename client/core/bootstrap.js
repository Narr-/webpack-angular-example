'use strict';

require('./vendor');
require('index.scss');

var appModule = require('index');
require('todo/todoStorage.factory');
require('todo/todoFocus.directive');
require('todo/todoEscape.directive');
require('todo/todo.controller');
require('todo/todo.html');

if (MODE.production) {
  require('./config/production')(appModule);
}
angular.element(document).ready(function() {
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});
