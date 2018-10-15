'use strict';

const config = require('./config.js'),
      mongoose = require('mongoose'),
      User = require('./models/user.schema.js'),
      Listing = require('./models/listing.schema.js');

mongoose.connect(config.db.uri, { useNewUrlParser: true });

var running = 0;
var shutdown = false;
// var closeOps = [];

var db = {};

db.users = {
  clear: () => {
    up();
    User.deleteMany({}, (err) => {
      down();

      if (err) {
        console.log(err);
      }
    });
  },

  add: (user) => {
    user = new User(user);

    up();
    user.save((err) => {
      down();

      if (err) {
        console.log(err);
      }
    });
  },

  delete: (user) => {
    up();
    User.deleteOne(user, (err, entry) => {
      down();

      if (err) {
        console.log(err);
        return false;
      }

      return true;
    });
  },

  findOne: (user) => {
    up();
    User.findOne(user, (err, entry) => {
      down();

      if (err) {
        console.log(err);
        return undefined;
      }

      return entry;
    });
  }
}

db.listings = {
  clear: () => {
    up();
    Listing.deleteMany({}, (err) => {
      down();

      if (err) {
        console.log(err);
      }
    });
  },

  add: (listing) => {
    listing = new Listing(listing);

    up();
    listing.save((err) => {
      down();

      if (err) {
        console.log(err);
      }
    });
  },

  delete: (listing) => {
    up();
    Listing.deleteOne(listing, (err, entry) => {
      down();

      if (err) {
        console.log(err);
        return false;
      }

      return true;
    });
  },

  findOne: (listing) => {
    up();
    User.findOne(listing, (err, entry) => {
      down();

      if (err) {
        console.log(err);
        return undefined;
      }

      return entry;
    });
  }
};

db.close = function() {
  if (!running) {
    mongoose.disconnect();
  } else {
    shutdown = true;
  }
}

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
