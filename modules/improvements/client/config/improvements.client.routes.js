(function () {
  'use strict';

  angular
    .module('improvements')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('improvements', {
        abstract: true,
        url: '/improvements',
        template: '<ui-view/>'
      })
      .state('improvements.list', {
        url: '',
        templateUrl: 'modules/improvements/client/views/list-improvements.client.view.html',
        controller: 'ImprovementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Improvements List'
        }
      })
      .state('improvements.create', {
        url: '/create',
        templateUrl: 'modules/improvements/client/views/form-improvement.client.view.html',
        controller: 'ImprovementsController',
        controllerAs: 'vm',
        resolve: {
          improvementResolve: newImprovement
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Improvements Create'
        }
      })
      .state('improvements.edit', {
        url: '/:improvementId/edit',
        templateUrl: 'modules/improvements/client/views/form-improvement.client.view.html',
        controller: 'ImprovementsController',
        controllerAs: 'vm',
        resolve: {
          improvementResolve: getImprovement
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Improvement {{ improvementResolve.name }}'
        }
      })
      .state('improvements.view', {
        url: '/:improvementId',
        templateUrl: 'modules/improvements/client/views/view-improvement.client.view.html',
        controller: 'ImprovementsController',
        controllerAs: 'vm',
        resolve: {
          improvementResolve: getImprovement
        },
        data:{
          pageTitle: 'Improvement {{ articleResolve.name }}'
        }
      });
  }

  getImprovement.$inject = ['$stateParams', 'ImprovementsService'];

  function getImprovement($stateParams, ImprovementsService) {
    return ImprovementsService.get({
      improvementId: $stateParams.improvementId
    }).$promise;
  }

  newImprovement.$inject = ['ImprovementsService'];

  function newImprovement(ImprovementsService) {
    return new ImprovementsService();
  }
})();
