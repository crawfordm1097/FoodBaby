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
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  room: String,
  info: String,
  food_type: String,
  meta: {
    score: {
      type: Number,
      default: 0
    },
    flagged: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date,
  twitter_id: String
});

listingSchema.pre('save', function(next) {
  var time = new Date;
  this.updated_at = time;
  next();
});

var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
