const users = require('../models/user.schema.js'),
      listings = require('../models/listing.schema.js'),
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


/*
  Upvote and down vote functionaltiy.
 */
exports.vote = function(req, res) {

  if(req.isAuthenticated()){

    let user = req.user;
    let voted_listing = undefined;
    let voted_listings = req.user.voted_listings;
    let listing_id = req.body.listing_id;
    let previously_voted = -1;

    for (let i=0; i < voted_listings.length; i++) {
      if (voted_listings[i].listing_id === listing_id) {
          voted_listing = voted_listings[i];
          previously_voted = i;
          break;
      }
    }
    
    if(voted_listing == undefined){
      voted_listing = {
        listing_id: listing_id,
        count: 1,
      };

      voted_listings.push(voted_listing);
    }else{
      voted_listing.count = voted_listing.count === 1 ? -1 : 1;
    }

    // update listing
    listings.findOne({'_id': listing_id}, function(err, listing){
      if(!err){
        listing.meta.score += voted_listing.count;

        if(listing.meta.score < 0)
          listing.meta.score = 0;

        listing.save();
      }else{
        res.status(404).send({count : 0});
      }
    });

    // save user
    users.findOne({'username': user.username}, function(err, user){
      if(!err){
        if(previously_voted == -1){
          user.voted_listings.push(voted_listing);
        }else{
          user.voted_listings[previously_voted].count = voted_listing.count;
        }
        user.save();
      }else{
        res.status(404).send({count : 0});
      }
    });

    res.status(200).send({count : voted_listing.count});

  }else{
    res.status(401).send();
  }
  
}