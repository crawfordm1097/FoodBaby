const listings = require('../models/listing.schema.js');

exports.create = function(req, res) {
  let listing = new listings(req.body);

  listing.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(listing);
    }
  });
}

exports.find = function(req, res) {
  let listing = req.params.listingId;

  listings.findOne({'_id': listing})
    .populate('location')
    .populate('posted_by')
    .exec((err, entry) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(entry);
      }
    });
}

exports.update = function(req, res) {
  let listing = req.listing;

  listings.findOneByIdAndUpdate(listing._id, req.body,
                                {'new': true}, (err, entry) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(entry);
    }
  });
}

exports.delete = function(req, res) {
  let listing = req.listing;

  listings.deleteOne(listing, (err, entry) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(entry);
    }
  });
}

exports.list = function(req, res) {
  listings.find({})
    .sort('time.start')
    .populate('location')
    .populate('posted_by')
    .exec((err, entries) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(entries);
    }
  });
}

exports.recent = function(req, res) {
  listings.findOne({})
    .sort('created_at')
    .populate('location')
    .populate('posted_by')
    .exec((err, entry) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(entry);
    }
  });
}
