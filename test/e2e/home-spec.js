'use strict';

describe('/', function() {

  beforeEach(function() {
    browser.get('http://localhost:' + require('../../server/config').PORT);
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toBe('AngularJS • TodoMVC');
  });

  it('should have three filters', function() {
    var filterCount;
    filterCount = element.all(by.css('#filters li a')).count();
    expect(filterCount).toBe(3);
  });
});
