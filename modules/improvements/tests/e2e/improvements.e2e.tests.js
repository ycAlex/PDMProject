'use strict';

describe('Improvements E2E Tests:', function () {
  describe('Test Improvements page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/improvements');
      expect(element.all(by.repeater('improvement in improvements')).count()).toEqual(0);
    });
  });
});
