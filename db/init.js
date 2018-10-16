'use strict';

const config = require('./config.js'),
      mongoose = require('mongoose'),
      User = require('./models/user.schema.js'),
      Listing = require('./models/listing.schema.js'),
      db = require('./control.js');

db.users.clear();
db.listings.clear();

db.close();
