(function () {
  'use strict';

  describe('Submissions Route Tests', function () {
    // Initialize global variables
    var $scope,
      SubmissionsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SubmissionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SubmissionsService = _SubmissionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('submissions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/submissions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SubmissionsController,
          mockSubmission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('submissions.view');
          $templateCache.put('modules/submissions/client/views/view-submission.client.view.html', '');

          // create mock Submission
          mockSubmission = new SubmissionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Submission Name'
          });

          //Initialize Controller
          SubmissionsController = $controller('SubmissionsController as vm', {
            $scope: $scope,
            submissionResolve: mockSubmission
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:submissionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.submissionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            submissionId: 1
          })).toEqual('/submissions/1');
        }));

        it('should attach an Submission to the controller scope', function () {
          expect($scope.vm.submission._id).toBe(mockSubmission._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/submissions/client/views/view-submission.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SubmissionsController,
          mockSubmission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('submissions.create');
          $templateCache.put('modules/submissions/client/views/form-submission.client.view.html', '');

          // create mock Submission
          mockSubmission = new SubmissionsService();

          //Initialize Controller
          SubmissionsController = $controller('SubmissionsController as vm', {
            $scope: $scope,
            submissionResolve: mockSubmission
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.submissionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/submissions/create');
        }));

        it('should attach an Submission to the controller scope', function () {
          expect($scope.vm.submission._id).toBe(mockSubmission._id);
          expect($scope.vm.submission._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/submissions/client/views/form-submission.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SubmissionsController,
          mockSubmission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('submissions.edit');
          $templateCache.put('modules/submissions/client/views/form-submission.client.view.html', '');

          // create mock Submission
          mockSubmission = new SubmissionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Submission Name'
          });

          //Initialize Controller
          SubmissionsController = $controller('SubmissionsController as vm', {
            $scope: $scope,
            submissionResolve: mockSubmission
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:submissionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.submissionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            submissionId: 1
          })).toEqual('/submissions/1/edit');
        }));

        it('should attach an Submission to the controller scope', function () {
          expect($scope.vm.submission._id).toBe(mockSubmission._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/submissions/client/views/form-submission.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
