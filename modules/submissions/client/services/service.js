(function () {
  'use strict';

  angular
    .module('submissions')
    .factory('Service', Service);

  Service.$inject = ['$resource'];

  function Service($resource) {
    return $resource('api/submissions/:submissionId', {
      submissionId: '@_id'
    }, {
      update:{
        method: 'PUT'
      }
    });
  }
})();
/**
 * Created by Alex on 9/04/2016.
 */
