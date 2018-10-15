'use strict';

const config = require('./config.js'),
      mongoose = require('mongoose'),
      User = require('./models/user.schema.js'),
      Listing = require('./models/listing.schema.js'),
      db = require('./control.js');

let testUser = new User({
  username: "Test User",
  password: "test"
});

let testListing = new Listing({
  name: "Test",
  time: {
    start: Date.now(),
    end: Date.now(),
  }
});


db.users.clear();
db.listings.clear();

db.close();
