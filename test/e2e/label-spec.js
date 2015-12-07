'use strict';

describe('load labels', function() {

  beforeEach(function() {
    browser.get('http://localhost:' + require('../../server/config').PORT);
  });

  it('should have 7 labels', function() {
    element(by.css('#header h1')).click();
    browser.wait(function() {
      return element(by.css('.label-group .label')).isPresent();
    }, 2000).then(function() {
      var labels = element.all(by.css('.label-group .label'));
      expect(labels.count()).toBe(7);
    });
  });
});
