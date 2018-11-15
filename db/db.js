'use strict';

const config = require('./config.js'),
      mongoose = require('mongoose'),
      User = require('./control/user.control.js'),
      Listing = require('./control/listing.control.js'),
      Location = require('./control/location.control.js');

mongoose.connect(config.db.uri, { useNewUrlParser: true });

var db = {};

db.users = User;
db.listings = Listing;
db.locations = Location;

db.close = function() {
  mongoose.disconnect();
};

module.exports = db;
