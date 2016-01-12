'use strict';

// require('core/bootstrap');
import 'core/bootstrap';
import 'angular-mocks';
var testsContext = require.context('../../client/', true, /.*?spec\.js/);
testsContext.keys().forEach(testsContext); // https://github.com/webpack/karma-webpack#alternative-usage
