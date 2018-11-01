'use strict';
const location = require('../models/location.schema.js'),
      fs = require('fs');

exports.clear = function() {
  location.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    }
  })
}

exports.init = function() {
  fs.readFile('./db/data/locations.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    data = JSON.parse(data).entries;
    location.insertMany(data, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}
