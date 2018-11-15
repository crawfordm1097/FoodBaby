const users = require('../models/user.schema.js');

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
