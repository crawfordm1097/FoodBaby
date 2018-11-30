var express = require('express'),
    listings = require('../db/control/listing.control.js'),
    user = require('../db/control/user.control.js'),
    router = express.Router();


login = function(app, passport){
    app.post('/user/login', 
        passport.authenticate('local',
            { 
                failWithError: true,    // to invoke the error callback
                failureFlash: true
            }), 
            function(req,res){
                res.send(req.user);
            },function(err, req, res, next) {
                res.status(401).send();
            }
    );
};

router.put('/upasswd', function(req, res){

    if(req.isAuthenticated() && req.user.comparePassword(req.body.oldPassword, req.user.password)){
        if(user.updatePassword(req.user.username, req.body.newPassword)){
            res.status(200).send();
        }else{
            res.status(503).send();
        }
    }else{
        res.status(401).send();
    }
});

router.post('/logout', function(req, res){
    req.logout();
    res.status(200).send();
});

module.exports = {
    login,
    router,
};




