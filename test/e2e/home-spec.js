'use strict';

describe('/', () => {

  beforeEach(() => {
    browser.get('http://localhost:' + require('../../server/config').PORT);
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toBe('AngularJS • TodoMVC');
  });

  it('should have three filters', () => {
    const filterCount = element.all(by.css('#filters li a')).count();
    expect(filterCount).toBe(3);
  });
});
