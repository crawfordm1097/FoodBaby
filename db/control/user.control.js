const users = require('../models/user.schema.js'),
      bcrypt = require('bcryptjs');

exports.create = function(req, res) {
  user = new users(req.body);

  users.findOne({ username: req.body.username }, (err, entry) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else if (entry) {
      res.status(401).send("Username already exists");
    } else {
      user.save(function(err) {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.status(200).send(user);
        }
      });
    }
  });
}

exports.findUserByUsername = function(username, callback) {
  users.findOne({ 'username' : username}, callback);
}

exports.updatePassword = function(username, newPassword) {
  let updateSuccessful = true;

  bcrypt.hash(newPassword, 8, function(err, hash) {
    if(err){
      updateSuccessful = false;
      return;
    }
    
    users.findOneAndUpdate({'username': username}, {$set:{'password':hash}}, {new: true}, function (err, account){
      if(err){
        updateSuccessful = false;
        return;
      }
    });
  });

  return updateSuccessful;
};
