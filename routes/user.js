var express = require('express');
var router = express.Router();
var listings = require('../db/control/listing.control.js');

login = function(app, passport){
    app.post('/user/login', 
        passport.authenticate('local',
            { 
                failWithError: true,    // to invoke the error callback
                failureFlash: true
            }), 
            function(req,res){
                // authentication successful
                console.log("Login Successful!");
                console.log(req.user);
                res.send(req.user);
            },function(err, req, res, next) {
                console.log(req.flash('LoginFailed'));
                res.status(401).send();
            }
    );
};

isLoggedIn = function(req, res, next) {
    console.log("Verifying if user is logged in...");
    if (req.isAuthenticated())
        return next();

    res.status(401).send();
};

router.get('/profile', isLoggedIn, function(req, res){
    console.log(req.user.username);
    let listingsPosteByUser = listings.findByUser(req.user.username);
    res.json(listingsPosteByUser);
});

module.exports = {
    login,
    router,
    isLoggedIn,
};




