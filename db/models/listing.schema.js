const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var twitter = require('../../config/twitter.js');

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

  if (!this.twitter_id) {

    let status = "New event:\n" + this.name +
                 " on " + this.time.start.toString().substring(0,15) +
                 ". Visit uffoodbaby.herokuapp.com for more details!";

    twitter.post('statuses/update',
      {
        status: status
      }, (err, tweet, res) => {
        if (err) {
          console.log(err);
          next();
        }
        console.log('Successfully posted tweet');
        this.twitter_id = tweet.id_str;
        next();
      });
  } else {
    next();
  }
});

listingSchema.post('findOneAndDelete', function(doc, next) {
  if (doc.twitter_id) {
    twitter.post('statuses/destroy/' + doc.twitter_id +
                 '.json', (err, tweet, res) => {
      if (err) {
        console.log(err);
        next();
      }
      console.log('Successfully deleted tweet');
      next();
    });
  } else {
    next();
  }
});

var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
