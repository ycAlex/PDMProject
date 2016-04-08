(function () {
  'use strict';

  angular
    .module('usercomments')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('usercomments', {
        abstract: true,
        url: '/usercomments',
        template: '<ui-view/>'
      })
      .state('usercomments.list', {
        url: '',
        templateUrl: 'modules/usercomments/client/views/list-usercomments.client.view.html',
        controller: 'UsercommentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Usercomments List'
        }
      })
      .state('usercomments.create', {
        url: '/create',
        templateUrl: 'modules/usercomments/client/views/form-usercomment.client.view.html',
        controller: 'UsercommentsController',
        controllerAs: 'vm',
        resolve: {
          usercommentResolve: newUsercomment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Usercomments Create'
        }
      })
      .state('usercomments.edit', {
        url: '/:usercommentId/edit',
        templateUrl: 'modules/usercomments/client/views/form-usercomment.client.view.html',
        controller: 'UsercommentsController',
        controllerAs: 'vm',
        resolve: {
          usercommentResolve: getUsercomment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Usercomment {{ usercommentResolve.name }}'
        }
      })
      .state('usercomments.view', {
        url: '/:usercommentId',
        templateUrl: 'modules/usercomments/client/views/view-usercomment.client.view.html',
        controller: 'UsercommentsController',
        controllerAs: 'vm',
        resolve: {
          usercommentResolve: getUsercomment
        },
        data:{
          pageTitle: 'Usercomment {{ articleResolve.name }}'
        }
      });
  }

  getUsercomment.$inject = ['$stateParams', 'UsercommentsService'];

  function getUsercomment($stateParams, UsercommentsService) {
    return UsercommentsService.get({
      usercommentId: $stateParams.usercommentId
    }).$promise;
  }

  newUsercomment.$inject = ['UsercommentsService'];

  function newUsercomment(UsercommentsService) {
    return new UsercommentsService();
  }
})();
