(function () {
  'use strict';

  angular
    .module('improvements')
    .controller('ImprovementsListController', ImprovementsListController);

  ImprovementsListController.$inject = ['ImprovementsService'];

  function ImprovementsListController(ImprovementsService) {
    var vm = this;

    vm.improvements = ImprovementsService.query();
  }
})();
