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
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  room: String,
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  food_type: String,
  meta: {
    up: {
      type: Number,
      default: 0
    },
    down: {
      type: Number,
      default: 0
    },
    flagged: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date
});

listingSchema.pre('save', function(next) {
  var time = new Date;
  this.updated_at = time;
  next();
});

var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
