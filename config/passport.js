var LocalStrategy   = require('passport-local').Strategy;
var User = require('../db/models/user.schema.js');
var Encrypter = require('../db/control/account.control.js');


module.exports = function(passport){
    
    /**  Serializing and deserializing user for persistent login **/

    // Serialze save username (as it is a key) to the session
    passport.serializeUser(function(user, done) {
        done(null, user.username);   // save to session as req.session.passsport.user = {username: 'username'}
    });

    // Deserialize uses the value (key) stored in the session to retrieve the user object and assign it to req.user
    passport.deserializeUser(function(username, done) {
        User.findOne({'username': username}, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, password, done) {
        console.log(email);
        console.log(password);

        process.nextTick(function() {

            // check if there exists a user with the same email
            User.findOne({ 'username' :  email }, function(err, user) {
            
                // if there are any errors, return the error
                if (err)
                    return done(err);

                if (user) {
                    console.log("Found user with same email!");
                    console.log(user);
                    return done(null, false, req.flash('SignUpFailed', 'That email is already taken.'));
                } else {
                    // create new user 
                    var newUser = new User();
                    newUser.username   = email;
                    newUser.password = Encrypter.encrypt(password);

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        console.log("User created succesfully!");
                        return done(null, newUser);
                    });
                }
            });    

        });

    }));

};