'use strict';

// require('./vendor');
import './vendor';
import 'index.scss';

// var appModule = require('index');
import appModule from 'index';
import 'todo/todo.controller';
import 'todo/todoSocket.factory';
import 'todo/todoStorage.factory';
import 'todo/todoFocus.directive';
import 'todo/todoEscape.directive';
import 'todo/todo.html';
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
