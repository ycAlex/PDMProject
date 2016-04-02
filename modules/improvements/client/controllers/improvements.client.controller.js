(function () {
  'use strict';

  // Improvements controller
  angular
    .module('improvements')
    .controller('ImprovementsController', ImprovementsController);

  ImprovementsController.$inject = ['$scope', '$state', 'Authentication', 'improvementResolve'];

  function ImprovementsController ($scope, $state, Authentication, improvement) {
    var vm = this;

    vm.authentication = Authentication;
    vm.improvement = improvement;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Improvement
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.improvement.$remove($state.go('improvements.list'));
      }
    }

    // Save Improvement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.improvementForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.improvement._id) {
        vm.improvement.$update(successCallback, errorCallback);
      } else {
        vm.improvement.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('improvements.view', {
          improvementId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
