'use strict';

describe('Submissions E2E Tests:', function () {
  describe('Test Submissions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/submissions');
      expect(element.all(by.repeater('submission in submissions')).count()).toEqual(0);
    });
  });
});
