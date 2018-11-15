'use strict';

var assert = require('assert'),
    db = require('../db/db.js'),
    User = require('../db/models/user.schema.js'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../app.js');

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

var user = {
  username: 'testuser',
  password: '1234'
};

var id;

describe('User', function() {
  describe('/POST new user', function() {
    it('should create a new user', function(done) {
      chai.request(server)
        .post('/api/user/register')
        .send(user)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('username').eql('testuser');

          id = res.body._id;
          done();
        });
    });

    it('should fail if user already exists', function(done) {
      chai.request(server)
        .post('/api/user/register')
        .send(user)
        .end(function(err, res) {
          res.should.have.status(401);
          res.body.should.be.eql({});
          res.text.should.be.a('string').eql('Username already exists');

          done();
        });
    });
  });
  describe('Get user and check password', function() {
    it('should get and properly authenticate', function(done) {
      chai.request(server)
        .post('/user/login')
        .send(user)
        .end(function(err, res) {
          res.should.have.status(200);

          done();
        });
    });
    it('should fail when given a wrong password', function(done) {
      user.password = "4321";
      chai.request(server)
        .post('/user/login')
        .send(user)
        .end(function(err, res) {
          res.should.have.status(401);

          done();
        });
    });
  });
  describe('Delete user properly', function() {
    it('should return the proper object', function(done) {
      User.findByIdAndRemove(id, function(err, entry) {
        entry.should.be.an('object');
        entry.should.have.property('username').eql('testuser');

        done();
      });
    });
    it('should no longer be in the database', function(done) {
      User.findById(id, function(err, entry) {
        expect(entry).to.be.null;

        done();
      });
    });
  });
});
