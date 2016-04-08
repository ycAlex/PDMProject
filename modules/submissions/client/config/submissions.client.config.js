(function () {
  'use strict';

  angular
    .module('submissions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Submissions',
      state: 'submissions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'submissions', {
      title: 'List Submissions',
      state: 'submissions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'submissions', {
      title: 'Create Submission',
      state: 'submissions.create',
      roles: ['user']
    });
  }
})();
