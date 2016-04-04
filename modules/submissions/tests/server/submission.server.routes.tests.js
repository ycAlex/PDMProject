'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Submission = mongoose.model('Submission'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, submission;

/**
 * Submission routes tests
 */
describe('Submission CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Submission
    user.save(function () {
      submission = {
        name: 'Submission name'
      };

      done();
    });
  });

  it('should be able to save a Submission if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Submission
        agent.post('/api/submissions')
          .send(submission)
          .expect(200)
          .end(function (submissionSaveErr, submissionSaveRes) {
            // Handle Submission save error
            if (submissionSaveErr) {
              return done(submissionSaveErr);
            }

            // Get a list of Submissions
            agent.get('/api/submissions')
              .end(function (submissionsGetErr, submissionsGetRes) {
                // Handle Submission save error
                if (submissionsGetErr) {
                  return done(submissionsGetErr);
                }

                // Get Submissions list
                var submissions = submissionsGetRes.body;

                // Set assertions
                (submissions[0].user._id).should.equal(userId);
                (submissions[0].name).should.match('Submission name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Submission if not logged in', function (done) {
    agent.post('/api/submissions')
      .send(submission)
      .expect(403)
      .end(function (submissionSaveErr, submissionSaveRes) {
        // Call the assertion callback
        done(submissionSaveErr);
      });
  });

  it('should not be able to save an Submission if no name is provided', function (done) {
    // Invalidate name field
    submission.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Submission
        agent.post('/api/submissions')
          .send(submission)
          .expect(400)
          .end(function (submissionSaveErr, submissionSaveRes) {
            // Set message assertion
            (submissionSaveRes.body.message).should.match('Please fill Submission name');

            // Handle Submission save error
            done(submissionSaveErr);
          });
      });
  });

  it('should be able to update an Submission if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Submission
        agent.post('/api/submissions')
          .send(submission)
          .expect(200)
          .end(function (submissionSaveErr, submissionSaveRes) {
            // Handle Submission save error
            if (submissionSaveErr) {
              return done(submissionSaveErr);
            }

            // Update Submission name
            submission.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Submission
            agent.put('/api/submissions/' + submissionSaveRes.body._id)
              .send(submission)
              .expect(200)
              .end(function (submissionUpdateErr, submissionUpdateRes) {
                // Handle Submission update error
                if (submissionUpdateErr) {
                  return done(submissionUpdateErr);
                }

                // Set assertions
                (submissionUpdateRes.body._id).should.equal(submissionSaveRes.body._id);
                (submissionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Submissions if not signed in', function (done) {
    // Create new Submission model instance
    var submissionObj = new Submission(submission);

    // Save the submission
    submissionObj.save(function () {
      // Request Submissions
      request(app).get('/api/submissions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Submission if not signed in', function (done) {
    // Create new Submission model instance
    var submissionObj = new Submission(submission);

    // Save the Submission
    submissionObj.save(function () {
      request(app).get('/api/submissions/' + submissionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', submission.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Submission with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/submissions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Submission is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Submission which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Submission
    request(app).get('/api/submissions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Submission with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Submission if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Submission
        agent.post('/api/submissions')
          .send(submission)
          .expect(200)
          .end(function (submissionSaveErr, submissionSaveRes) {
            // Handle Submission save error
            if (submissionSaveErr) {
              return done(submissionSaveErr);
            }

            // Delete an existing Submission
            agent.delete('/api/submissions/' + submissionSaveRes.body._id)
              .send(submission)
              .expect(200)
              .end(function (submissionDeleteErr, submissionDeleteRes) {
                // Handle submission error error
                if (submissionDeleteErr) {
                  return done(submissionDeleteErr);
                }

                // Set assertions
                (submissionDeleteRes.body._id).should.equal(submissionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Submission if not signed in', function (done) {
    // Set Submission user
    submission.user = user;

    // Create new Submission model instance
    var submissionObj = new Submission(submission);

    // Save the Submission
    submissionObj.save(function () {
      // Try deleting Submission
      request(app).delete('/api/submissions/' + submissionObj._id)
        .expect(403)
        .end(function (submissionDeleteErr, submissionDeleteRes) {
          // Set message assertion
          (submissionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Submission error error
          done(submissionDeleteErr);
        });

    });
  });

  it('should be able to get a single Submission that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Submission
          agent.post('/api/submissions')
            .send(submission)
            .expect(200)
            .end(function (submissionSaveErr, submissionSaveRes) {
              // Handle Submission save error
              if (submissionSaveErr) {
                return done(submissionSaveErr);
              }

              // Set assertions on new Submission
              (submissionSaveRes.body.name).should.equal(submission.name);
              should.exist(submissionSaveRes.body.user);
              should.equal(submissionSaveRes.body.user._id, orphanId);

              // force the Submission to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Submission
                    agent.get('/api/submissions/' + submissionSaveRes.body._id)
                      .expect(200)
                      .end(function (submissionInfoErr, submissionInfoRes) {
                        // Handle Submission error
                        if (submissionInfoErr) {
                          return done(submissionInfoErr);
                        }

                        // Set assertions
                        (submissionInfoRes.body._id).should.equal(submissionSaveRes.body._id);
                        (submissionInfoRes.body.name).should.equal(submission.name);
                        should.equal(submissionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Submission.remove().exec(done);
    });
  });
});
