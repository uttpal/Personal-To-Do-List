// config/passport.js


var LocalStrategy   = require('passport-local').Strategy;

// get user model
var User            = require('../app/models/user');


module.exports = function(passport) {

    // passport session setup --------------------------------------------------
    // -------------------------------------------------------------------------
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP ------------------------------------------------------------
    // -------------------------------------------------------------------------

    passport.use('local-signup', new LocalStrategy({
        
        //overide the default username field to email
        usernameField : 'email',                                    
        passwordField : 'password',

        //pass entire request to callback
        passReqToCallback : true                                    
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'Email already in use.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

};
