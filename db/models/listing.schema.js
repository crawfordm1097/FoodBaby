const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  location: {
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    building: {
      name: String,
      room: String,
    },
    address: String
  },
  food_type: String,
  meta: {
    up: Number,
    down: Number,
    flagged: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date
});

listingSchema.pre('save', (next) => {
  var time = new Date;
  this.updated_at = time;
  next();
});

var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
