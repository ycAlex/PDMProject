//Submissions service used to communicate Submissions REST endpoints
(function () {
  'use strict';

  angular
    .module('submissions')
    .factory('SubmissionsService', SubmissionsService);

  SubmissionsService.$inject = ['$resource'];

  function SubmissionsService($resource) {
    return $resource('api/submissions/:submissionId', {
      submissionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
