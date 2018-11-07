var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

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

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.username, 8, function(err, hash) {
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(cp, next) {
  bcrypt.compare(cp, this.password, function(err, good) {
    if (err) {
      return next(err);
    }

    next(null, good);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
