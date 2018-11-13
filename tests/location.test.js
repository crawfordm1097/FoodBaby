'use strict';

var assert = require('assert'),
    db = require('../db/db.js'),
    chai = require('chai'),
    Location = require('../db/models/location.schema.js'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../app.js');

process.env.NODE_ENV = 'test';

describe('Location', function() {
  describe('Get locations', function() {
    it('should return database of size 147', function(done) {
      Location.find({}, function(err, entries) {
        expect(err).to.be.null;
        entries.should.be.an('array');
        entries.should.have.lengthOf(147);

        done();
      });
    });
    it('should have the correct data', function(done) {
      Location.findOne({ code: "CSFL" }, function(err, entry) {
        expect(err).to.be.null;
        entry.should.be.an('object');
        entry.should.have.property('name').eql('Crops and Soils Field Lab');

        done();
      });
    });
  });
});
