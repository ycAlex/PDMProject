//Improvements service used to communicate Improvements REST endpoints
(function () {
  'use strict';

  angular
    .module('improvements')
    .factory('ImprovementsService', ImprovementsService);

  ImprovementsService.$inject = ['$resource'];

  function ImprovementsService($resource) {
    return $resource('api/improvements/:improvementId', {
      improvementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
