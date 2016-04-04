(function () {
  'use strict';

  describe('Usercomments Route Tests', function () {
    // Initialize global variables
    var $scope,
      UsercommentsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UsercommentsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UsercommentsService = _UsercommentsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('usercomments');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/usercomments');
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
          UsercommentsController,
          mockUsercomment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('usercomments.view');
          $templateCache.put('modules/usercomments/client/views/view-usercomment.client.view.html', '');

          // create mock Usercomment
          mockUsercomment = new UsercommentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Usercomment Name'
          });

          //Initialize Controller
          UsercommentsController = $controller('UsercommentsController as vm', {
            $scope: $scope,
            usercommentResolve: mockUsercomment
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:usercommentId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.usercommentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            usercommentId: 1
          })).toEqual('/usercomments/1');
        }));

        it('should attach an Usercomment to the controller scope', function () {
          expect($scope.vm.usercomment._id).toBe(mockUsercomment._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/usercomments/client/views/view-usercomment.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UsercommentsController,
          mockUsercomment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('usercomments.create');
          $templateCache.put('modules/usercomments/client/views/form-usercomment.client.view.html', '');

          // create mock Usercomment
          mockUsercomment = new UsercommentsService();

          //Initialize Controller
          UsercommentsController = $controller('UsercommentsController as vm', {
            $scope: $scope,
            usercommentResolve: mockUsercomment
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.usercommentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/usercomments/create');
        }));

        it('should attach an Usercomment to the controller scope', function () {
          expect($scope.vm.usercomment._id).toBe(mockUsercomment._id);
          expect($scope.vm.usercomment._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/usercomments/client/views/form-usercomment.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UsercommentsController,
          mockUsercomment;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('usercomments.edit');
          $templateCache.put('modules/usercomments/client/views/form-usercomment.client.view.html', '');

          // create mock Usercomment
          mockUsercomment = new UsercommentsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Usercomment Name'
          });

          //Initialize Controller
          UsercommentsController = $controller('UsercommentsController as vm', {
            $scope: $scope,
            usercommentResolve: mockUsercomment
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:usercommentId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.usercommentResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            usercommentId: 1
          })).toEqual('/usercomments/1/edit');
        }));

        it('should attach an Usercomment to the controller scope', function () {
          expect($scope.vm.usercomment._id).toBe(mockUsercomment._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/usercomments/client/views/form-usercomment.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
