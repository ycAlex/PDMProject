(function () {
  'use strict';

  angular
    .module('submissions')
    .controller('SubmissionsListController', SubmissionsListController);

  SubmissionsListController.$inject = ['SubmissionsService'];

  function SubmissionsListController(SubmissionsService) {
    var vm = this;

    vm.submissions = SubmissionsService.query();
  }
})();
