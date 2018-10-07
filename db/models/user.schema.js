const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  meta: {
    postings: Number,
    karma: Number,
  }
});

userSchema.pre('save', (next) => {
  //TODO if needed
  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;
