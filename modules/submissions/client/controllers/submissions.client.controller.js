(function () {
  'use strict';

  // Submissions controller
  angular
    .module('submissions')
    .controller('SubmissionsController', SubmissionsController);

  SubmissionsController.$inject = ['$scope', '$state', 'Authentication', 'submissionResolve'];

  function SubmissionsController ($scope, $state, Authentication, submission) {
    var vm = this;

    vm.authentication = Authentication;
    vm.submission = submission;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Submission
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.submission.$remove($state.go('submissions.list'));
      }
    }

    // Save Submission
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.submissionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.submission._id) {
        vm.submission.$update(successCallback, errorCallback);
      } else {
        vm.submission.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('submissions.view', {
          submissionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
