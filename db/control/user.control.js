const users = require('../models/user.schema.js');

exports.create = function(req, res) {
  user = new users(req.body);

  users.findOne({ username: req.body.username }, (err, entry) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else if (entry) {
      console.log(err);
      res.status(400).send("Username already exists");
    } else {
      user.save((err) => {
        if (err) {
          console.log(err);
          res.status(400).send(err);
        } else {
          res.send(user);
        }
      });
    }
  });
}
