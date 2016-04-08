'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Improvement = mongoose.model('Improvement'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, improvement;

/**
 * Improvement routes tests
 */
describe('Improvement CRUD tests', function () {

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

    // Save a user to the test db and create new Improvement
    user.save(function () {
      improvement = {
        name: 'Improvement name'
      };

      done();
    });
  });

  it('should be able to save a Improvement if logged in', function (done) {
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

        // Save a new Improvement
        agent.post('/api/improvements')
          .send(improvement)
          .expect(200)
          .end(function (improvementSaveErr, improvementSaveRes) {
            // Handle Improvement save error
            if (improvementSaveErr) {
              return done(improvementSaveErr);
            }

            // Get a list of Improvements
            agent.get('/api/improvements')
              .end(function (improvementsGetErr, improvementsGetRes) {
                // Handle Improvement save error
                if (improvementsGetErr) {
                  return done(improvementsGetErr);
                }

                // Get Improvements list
                var improvements = improvementsGetRes.body;

                // Set assertions
                (improvements[0].user._id).should.equal(userId);
                (improvements[0].name).should.match('Improvement name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Improvement if not logged in', function (done) {
    agent.post('/api/improvements')
      .send(improvement)
      .expect(403)
      .end(function (improvementSaveErr, improvementSaveRes) {
        // Call the assertion callback
        done(improvementSaveErr);
      });
  });

  it('should not be able to save an Improvement if no name is provided', function (done) {
    // Invalidate name field
    improvement.name = '';

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

        // Save a new Improvement
        agent.post('/api/improvements')
          .send(improvement)
          .expect(400)
          .end(function (improvementSaveErr, improvementSaveRes) {
            // Set message assertion
            (improvementSaveRes.body.message).should.match('Please fill Improvement name');

            // Handle Improvement save error
            done(improvementSaveErr);
          });
      });
  });

  it('should be able to update an Improvement if signed in', function (done) {
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

        // Save a new Improvement
        agent.post('/api/improvements')
          .send(improvement)
          .expect(200)
          .end(function (improvementSaveErr, improvementSaveRes) {
            // Handle Improvement save error
            if (improvementSaveErr) {
              return done(improvementSaveErr);
            }

            // Update Improvement name
            improvement.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Improvement
            agent.put('/api/improvements/' + improvementSaveRes.body._id)
              .send(improvement)
              .expect(200)
              .end(function (improvementUpdateErr, improvementUpdateRes) {
                // Handle Improvement update error
                if (improvementUpdateErr) {
                  return done(improvementUpdateErr);
                }

                // Set assertions
                (improvementUpdateRes.body._id).should.equal(improvementSaveRes.body._id);
                (improvementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Improvements if not signed in', function (done) {
    // Create new Improvement model instance
    var improvementObj = new Improvement(improvement);

    // Save the improvement
    improvementObj.save(function () {
      // Request Improvements
      request(app).get('/api/improvements')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Improvement if not signed in', function (done) {
    // Create new Improvement model instance
    var improvementObj = new Improvement(improvement);

    // Save the Improvement
    improvementObj.save(function () {
      request(app).get('/api/improvements/' + improvementObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', improvement.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Improvement with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/improvements/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Improvement is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Improvement which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Improvement
    request(app).get('/api/improvements/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Improvement with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Improvement if signed in', function (done) {
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

        // Save a new Improvement
        agent.post('/api/improvements')
          .send(improvement)
          .expect(200)
          .end(function (improvementSaveErr, improvementSaveRes) {
            // Handle Improvement save error
            if (improvementSaveErr) {
              return done(improvementSaveErr);
            }

            // Delete an existing Improvement
            agent.delete('/api/improvements/' + improvementSaveRes.body._id)
              .send(improvement)
              .expect(200)
              .end(function (improvementDeleteErr, improvementDeleteRes) {
                // Handle improvement error error
                if (improvementDeleteErr) {
                  return done(improvementDeleteErr);
                }

                // Set assertions
                (improvementDeleteRes.body._id).should.equal(improvementSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Improvement if not signed in', function (done) {
    // Set Improvement user
    improvement.user = user;

    // Create new Improvement model instance
    var improvementObj = new Improvement(improvement);

    // Save the Improvement
    improvementObj.save(function () {
      // Try deleting Improvement
      request(app).delete('/api/improvements/' + improvementObj._id)
        .expect(403)
        .end(function (improvementDeleteErr, improvementDeleteRes) {
          // Set message assertion
          (improvementDeleteRes.body.message).should.match('User is not authorized');

          // Handle Improvement error error
          done(improvementDeleteErr);
        });

    });
  });

  it('should be able to get a single Improvement that has an orphaned user reference', function (done) {
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

          // Save a new Improvement
          agent.post('/api/improvements')
            .send(improvement)
            .expect(200)
            .end(function (improvementSaveErr, improvementSaveRes) {
              // Handle Improvement save error
              if (improvementSaveErr) {
                return done(improvementSaveErr);
              }

              // Set assertions on new Improvement
              (improvementSaveRes.body.name).should.equal(improvement.name);
              should.exist(improvementSaveRes.body.user);
              should.equal(improvementSaveRes.body.user._id, orphanId);

              // force the Improvement to have an orphaned user reference
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

                    // Get the Improvement
                    agent.get('/api/improvements/' + improvementSaveRes.body._id)
                      .expect(200)
                      .end(function (improvementInfoErr, improvementInfoRes) {
                        // Handle Improvement error
                        if (improvementInfoErr) {
                          return done(improvementInfoErr);
                        }

                        // Set assertions
                        (improvementInfoRes.body._id).should.equal(improvementSaveRes.body._id);
                        (improvementInfoRes.body.name).should.equal(improvement.name);
                        should.equal(improvementInfoRes.body.user, undefined);

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
      Improvement.remove().exec(done);
    });
  });
});
