module.exports = function(app, passport) {

    app.post('/login', passport.authenticate('local-signup', {
        successRedirect : '/profile',            // redirect to the secure profile section
        failureRedirect : '/login',              // redirect back to the login page if there is an error
        failureFlash : true                      // allow flash messages
    }));
   
};