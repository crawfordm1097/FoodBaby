'use strict';

const config = require('./config.js'),
      mongoose = require('mongoose'),
      User = require('./control/user.control.js'),
      Listing = require('./control/listing.control.js'),
      Account = require('./control/account.control.js');

mongoose.connect(config.db.uri, { useNewUrlParser: true });


var db = {};

db.users = User;
db.listings = Listing;

module.exports = db;
