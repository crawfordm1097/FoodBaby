const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = new Schema({
  //TODO
});

listingSchema.pre('save', (next) => {
  var time = new Date;
  this.updated_at = time;
  next();
});

var Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
