'use strict';

describe('load labels', () => {

  beforeEach(() => {
    browser.get('http://localhost:' + require('../../server/config').PORT);
  });

  it('should have 7 labels', () => {
    element(by.css('#header h1')).click();
    browser
      .wait(() => element(by.css('.label-group .label')).isPresent(), 2000)
      .then(() => {
        const labels = element.all(by.css('.label-group .label'));
        expect(labels.count()).toBe(7);
      });
  });
});
