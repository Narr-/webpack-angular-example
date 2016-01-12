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
import 'label_group/labelGroup.service';
import 'label_group/labelGroup.directive';
import 'label_group/labelGroup.controller';

if (WEBPACK_VAR.mode.production) {
  // import production from './config/production'; // 'import' and 'export' may only appear at the top level
  require('./config/production').default(appModule);
}
angular.element(document).ready(() => {
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});
