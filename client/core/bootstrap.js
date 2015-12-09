'use strict';

require('./vendor');
require('index.scss');

var appModule = require('index');
require('todo/todo.controller');
require('todo/todoSocket.factory');
require('todo/todoStorage.factory');
require('todo/todoFocus.directive');
require('todo/todoEscape.directive');
require('todo/todo.html');
require('label_group/labelGroup.service');
require('label_group/labelGroup.directive');
require('label_group/labelGroup.controller');

if (WEBPACK_VAR.mode.production) {
  require('./config/production')(appModule);
}
angular.element(document).ready(function() {
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});
