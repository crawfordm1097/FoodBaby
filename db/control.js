'use strict';

const config = require('./config.js'),
      mongoose = require('mongoose'),
      User = require('./models/user.schema.js'),
      Listing = require('./models/listing.schema.js');

mongoose.connect(config.db.uri, { useNewUrlParser: true });

var running = 0;
var shutdown = false;
// var closeOps = [];

var db = {
  clearUsers: () => {
    up();
    User.deleteMany({}, (err) => {
      if (err) {
        console.log(err);
      }

      down();
    });
  },

  addUser: (user) => {
    user = new User(user);

    up();
    user.save((err) => {
      if (err) {
        console.log(err);
      }

      down();
    });
  },

  clearListings: () => {
    up();
    Listing.deleteMany({}, (err) => {
      if (err) {
        console.log(err);
      }

      down();
    });
  },

  addListing: (listing) => {
    listing = new Listing(listing);

    up();
    listing.save((err) => {
      if (err) {
        console.log(err);
      }

      down();
    });
  },

  // onClose: (func) => {
  //   closeOps.push(func);
  // },

  close: () => {
    if (!running) {
      mongoose.disconnect();
    } else {
      shutdown = true;
    }
  }
};

function up() {
  running += 1;
}

function down() {
  running -= 1;
  if (shutdown && !running) {
    db.close();
  }
}

module.exports = db;
