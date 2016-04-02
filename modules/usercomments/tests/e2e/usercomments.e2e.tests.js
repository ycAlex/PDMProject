'use strict';

describe('Usercomments E2E Tests:', function () {
  describe('Test Usercomments page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/usercomments');
      expect(element.all(by.repeater('usercomment in usercomments')).count()).toEqual(0);
    });
  });
});
