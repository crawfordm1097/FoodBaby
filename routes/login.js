module.exports = function(app, passport) {

    app.post('/user/login', passport.authenticate('local', {
        successRedirect : '/user/profile',       // redirect to the secure profile section
        failureRedirect : '/user/login',         // redirect back to the login page if there is an error
        failureFlash : true                      // allow flash messages
    }));
   
};




