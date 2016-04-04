'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Usercomment = mongoose.model('Usercomment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, usercomment;

/**
 * Usercomment routes tests
 */
describe('Usercomment CRUD tests', function () {

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

    // Save a user to the test db and create new Usercomment
    user.save(function () {
      usercomment = {
        name: 'Usercomment name'
      };

      done();
    });
  });

  it('should be able to save a Usercomment if logged in', function (done) {
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

        // Save a new Usercomment
        agent.post('/api/usercomments')
          .send(usercomment)
          .expect(200)
          .end(function (usercommentSaveErr, usercommentSaveRes) {
            // Handle Usercomment save error
            if (usercommentSaveErr) {
              return done(usercommentSaveErr);
            }

            // Get a list of Usercomments
            agent.get('/api/usercomments')
              .end(function (usercommentsGetErr, usercommentsGetRes) {
                // Handle Usercomment save error
                if (usercommentsGetErr) {
                  return done(usercommentsGetErr);
                }

                // Get Usercomments list
                var usercomments = usercommentsGetRes.body;

                // Set assertions
                (usercomments[0].user._id).should.equal(userId);
                (usercomments[0].name).should.match('Usercomment name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Usercomment if not logged in', function (done) {
    agent.post('/api/usercomments')
      .send(usercomment)
      .expect(403)
      .end(function (usercommentSaveErr, usercommentSaveRes) {
        // Call the assertion callback
        done(usercommentSaveErr);
      });
  });

  it('should not be able to save an Usercomment if no name is provided', function (done) {
    // Invalidate name field
    usercomment.name = '';

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

        // Save a new Usercomment
        agent.post('/api/usercomments')
          .send(usercomment)
          .expect(400)
          .end(function (usercommentSaveErr, usercommentSaveRes) {
            // Set message assertion
            (usercommentSaveRes.body.message).should.match('Please fill Usercomment name');

            // Handle Usercomment save error
            done(usercommentSaveErr);
          });
      });
  });

  it('should be able to update an Usercomment if signed in', function (done) {
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

        // Save a new Usercomment
        agent.post('/api/usercomments')
          .send(usercomment)
          .expect(200)
          .end(function (usercommentSaveErr, usercommentSaveRes) {
            // Handle Usercomment save error
            if (usercommentSaveErr) {
              return done(usercommentSaveErr);
            }

            // Update Usercomment name
            usercomment.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Usercomment
            agent.put('/api/usercomments/' + usercommentSaveRes.body._id)
              .send(usercomment)
              .expect(200)
              .end(function (usercommentUpdateErr, usercommentUpdateRes) {
                // Handle Usercomment update error
                if (usercommentUpdateErr) {
                  return done(usercommentUpdateErr);
                }

                // Set assertions
                (usercommentUpdateRes.body._id).should.equal(usercommentSaveRes.body._id);
                (usercommentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Usercomments if not signed in', function (done) {
    // Create new Usercomment model instance
    var usercommentObj = new Usercomment(usercomment);

    // Save the usercomment
    usercommentObj.save(function () {
      // Request Usercomments
      request(app).get('/api/usercomments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Usercomment if not signed in', function (done) {
    // Create new Usercomment model instance
    var usercommentObj = new Usercomment(usercomment);

    // Save the Usercomment
    usercommentObj.save(function () {
      request(app).get('/api/usercomments/' + usercommentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', usercomment.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Usercomment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/usercomments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Usercomment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Usercomment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Usercomment
    request(app).get('/api/usercomments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Usercomment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Usercomment if signed in', function (done) {
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

        // Save a new Usercomment
        agent.post('/api/usercomments')
          .send(usercomment)
          .expect(200)
          .end(function (usercommentSaveErr, usercommentSaveRes) {
            // Handle Usercomment save error
            if (usercommentSaveErr) {
              return done(usercommentSaveErr);
            }

            // Delete an existing Usercomment
            agent.delete('/api/usercomments/' + usercommentSaveRes.body._id)
              .send(usercomment)
              .expect(200)
              .end(function (usercommentDeleteErr, usercommentDeleteRes) {
                // Handle usercomment error error
                if (usercommentDeleteErr) {
                  return done(usercommentDeleteErr);
                }

                // Set assertions
                (usercommentDeleteRes.body._id).should.equal(usercommentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Usercomment if not signed in', function (done) {
    // Set Usercomment user
    usercomment.user = user;

    // Create new Usercomment model instance
    var usercommentObj = new Usercomment(usercomment);

    // Save the Usercomment
    usercommentObj.save(function () {
      // Try deleting Usercomment
      request(app).delete('/api/usercomments/' + usercommentObj._id)
        .expect(403)
        .end(function (usercommentDeleteErr, usercommentDeleteRes) {
          // Set message assertion
          (usercommentDeleteRes.body.message).should.match('User is not authorized');

          // Handle Usercomment error error
          done(usercommentDeleteErr);
        });

    });
  });

  it('should be able to get a single Usercomment that has an orphaned user reference', function (done) {
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

          // Save a new Usercomment
          agent.post('/api/usercomments')
            .send(usercomment)
            .expect(200)
            .end(function (usercommentSaveErr, usercommentSaveRes) {
              // Handle Usercomment save error
              if (usercommentSaveErr) {
                return done(usercommentSaveErr);
              }

              // Set assertions on new Usercomment
              (usercommentSaveRes.body.name).should.equal(usercomment.name);
              should.exist(usercommentSaveRes.body.user);
              should.equal(usercommentSaveRes.body.user._id, orphanId);

              // force the Usercomment to have an orphaned user reference
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

                    // Get the Usercomment
                    agent.get('/api/usercomments/' + usercommentSaveRes.body._id)
                      .expect(200)
                      .end(function (usercommentInfoErr, usercommentInfoRes) {
                        // Handle Usercomment error
                        if (usercommentInfoErr) {
                          return done(usercommentInfoErr);
                        }

                        // Set assertions
                        (usercommentInfoRes.body._id).should.equal(usercommentSaveRes.body._id);
                        (usercommentInfoRes.body.name).should.equal(usercomment.name);
                        should.equal(usercommentInfoRes.body.user, undefined);

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
      Usercomment.remove().exec(done);
    });
  });
});
