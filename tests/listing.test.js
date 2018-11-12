'use strict';

var assert = require('assert'),
    db = require('../db/db.js'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    server = require('../app.js');

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Listing', function() {
  describe('/GET listings', function() {
    it('should get upcoming events', (done) => {
      chai.request(server)
        .get('/api/listings')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
    it('should get recent events', (done) => {
      chai.request(server)
        .get('/api/listings/recent')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });
  });
  describe('/POST listings', function() {
    var lId;
    it('should create a new listing', function(done) {
      let listing = {
        name: 'test listing',
        time: {
          start: Date.now(),
          end: Date.now()
        }
      };
      chai.request(server)
        .post('/api/listings')
        .send(listing)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name');
          res.body.should.have.property('time');

          lId = res.body._id;
          done();
        });
    });

    describe('/PUT listing', function() {
      it('should update the created listing', function(done) {
        let listing = {
          name: 'updated test',
        };

        chai.request(server)
          .put('/api/listings/id/' + lId)
          .send(listing)
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('name').eql('updated test');

            done();
          });
      });
    });

    describe('/DELETE listing', function() {
      it('should delete the created listing', function(done) {
        chai.request(server)
          .delete('/api/listings/id/' + lId)
          .end(function(req, res) {
            res.should.have.status(200);
            res.body.should.be.an('object');

            res.body._id.should.equal(lId);

            done();
          });
      });
    });
  });
});

after(function() {
  db.close();
});
