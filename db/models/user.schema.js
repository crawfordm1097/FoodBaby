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
  }
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, 8, function(err, hash) {
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password, hash) {
  return bcrypt.compareSync(password, hash);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
