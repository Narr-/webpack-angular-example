'use strict';

module.exports = {
  // An example configuration file.
  config: {
    // Boolean. If true, Protractor will connect directly to the browser Drivers
    // at the locations specified by chromeDriver and firefoxPath. Only Chrome
    // and Firefox are supported for direct connect.
    directConnect: true, // https://github.com/angular/angular-phonecat/issues/276

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: '*-spec.js',

    capabilities: {
      'browserName': 'firefox'
    },

    onPrepare: function() {
      var SpecReporter = require('jasmine-spec-reporter');
      // add jasmine spec reporter - https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/protractor-configuration.md#protractor-configuration
      jasmine.getEnv().addReporter(new SpecReporter({
        displayStacktrace: 'all'
      }));

      browser.driver.manage().window().maximize();
    },

    framework: 'jasmine',

    jasmineNodeOpts: {
      print: function() {} // https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/protractor-configuration.md#remove-protractor-dot-reporter
    }
  }
};
