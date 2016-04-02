(function () {
  'use strict';

  angular
    .module('usercomments')
    .controller('UsercommentsListController', UsercommentsListController);

  UsercommentsListController.$inject = ['UsercommentsService'];

  function UsercommentsListController(UsercommentsService) {
    var vm = this;

    vm.usercomments = UsercommentsService.query();
  }
})();
