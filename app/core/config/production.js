'use strict';

module.exports = function(appModule) {
  appModule.config(function($compileProvider, $httpProvider) {
    /* less watchers from console debugging: https://docs.angularjs.org/guide/production */
    $compileProvider.debugInfoEnabled(false);
    /* process multiple responses @ same time: https://docs.angularjs.org/api/ng/provider/$httpProvider */
    $httpProvider.useApplyAsync(true);
  });
};
