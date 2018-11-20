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

router.put('/upasswd', function(req, res){

    if(req.user && req.user.comparePassword(req.body.oldPassword, req.user.password)){
        if(user.updatePassword(req.user.username, req.body.newPassword)){
            res.status(200).send();
        }else{
            res.status(503).send();
        }
    }else{
        res.status(401).send();
    }
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = {
    login,
    router,
};




