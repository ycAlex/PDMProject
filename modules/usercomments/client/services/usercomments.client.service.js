//Usercomments service used to communicate Usercomments REST endpoints
(function () {
  'use strict';

  angular
    .module('usercomments')
    .factory('UsercommentsService', UsercommentsService);

  UsercommentsService.$inject = ['$resource'];

  function UsercommentsService($resource) {
    return $resource('api/usercomments/:usercommentId', {
      usercommentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
