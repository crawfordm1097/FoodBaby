'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: String,
  code: {
    type: String,
    unique: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: String
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;
