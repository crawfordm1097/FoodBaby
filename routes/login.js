module.exports = function(app, passport) {

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




