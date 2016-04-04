(function () {
  'use strict';

  angular
    .module('submissions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('submissions', {
        abstract: true,
        url: '/submissions',
        template: '<ui-view/>'
      })
      .state('submissions.list', {
        url: '',
        templateUrl: 'modules/submissions/client/views/list-submissions.client.view.html',
        controller: 'SubmissionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Submissions List'
        }
      })
      .state('submissions.create', {
        url: '/create',
        templateUrl: 'modules/submissions/client/views/form-submission.client.view.html',
        controller: 'SubmissionsController',
        controllerAs: 'vm',
        resolve: {
          submissionResolve: newSubmission
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Submissions Create'
        }
      })
      .state('submissions.edit', {
        url: '/:submissionId/edit',
        templateUrl: 'modules/submissions/client/views/form-submission.client.view.html',
        controller: 'SubmissionsController',
        controllerAs: 'vm',
        resolve: {
          submissionResolve: getSubmission
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Submission {{ submissionResolve.name }}'
        }
      })
      .state('submissions.view', {
        url: '/:submissionId',
        templateUrl: 'modules/submissions/client/views/view-submission.client.view.html',
        controller: 'SubmissionsController',
        controllerAs: 'vm',
        resolve: {
          submissionResolve: getSubmission
        },
        data:{
          pageTitle: 'Submission {{ articleResolve.name }}'
        }
      });
  }

  getSubmission.$inject = ['$stateParams', 'SubmissionsService'];

  function getSubmission($stateParams, SubmissionsService) {
    return SubmissionsService.get({
      submissionId: $stateParams.submissionId
    }).$promise;
  }

  newSubmission.$inject = ['SubmissionsService'];

  function newSubmission(SubmissionsService) {
    return new SubmissionsService();
  }
})();
