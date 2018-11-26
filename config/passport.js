var LocalStrategy   = require('passport-local').Strategy;
var UserSchemaUtils = require('../db/control/user.control.js');
var User = require('../db/models/user.schema.js');


module.exports = function(passport){

    /**  Serializing and deserializing user for persistent login **/
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        UserSchemaUtils.findUserByUsername(username, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({passReqToCallback : true},
        
        function(req, username, password, done){
            UserSchemaUtils.findUserByUsername(username, function(err, user){

                if(err){
                    return done(null, false, req.flash('LoginFailed', 'Something went wrong!'));
                }
                
                if(!user){
                    return done(null, false, req.flash('LoginFailed', 'Username does not exist!'));
                }

                if(user.comparePassword(password, user.password)){
                    return done(null, user);
                }

                return done(null, false,  req.flash('LoginFailed', 'Invalid passsword!'));        
            })
    }))
};
