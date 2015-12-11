// config/passport.js


var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;


// get user model
var User             = require('../app/models/user');

//get auth variables
var configAuth       = require('./auth');

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

    // local signup ------------------------------------------------------------
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

    // local login ------------------------------------------------------------
    // -------------------------------------------------------------------------
    

    passport.use('local-login', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 

        // find user with email requested
        User.findOne({ 'local.email' :  email }, function(err, user) {
            
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No such user found.')); 

            // if password is wrong
            if (!user.validatePassword(password))
                return done(null, false, req.flash('loginMessage', 'Invalid Credentials')); // create the loginMessage and save it to session as flashdata

            //else return user
            return done(null, user);
        });

    }));

    // facebook login ------------------------------------------------------------
    // ---------------------------------------------------------------------------

    passport.use(new FacebookStrategy({

        // config sett. from auth.js
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ['email']                                     //add to request email field from facebook

    },

    // Recive facebook tokens
    function(token, refreshToken, profile, done) {

        
        process.nextTick(function() {

            // find user from facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                // if user found login
                if (user) {
                    return done(null, user);                            // user found, return that user
                } else {
                    // no user found!! create new
                    var newUser            = new User();

                    // set parameters in of user
                    newUser.facebook.id    = profile.id;              
                    newUser.facebook.token = token;             
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; 
                    newUser.facebook.email = profile.emails[0].value;   // save first of multiple returned emails

                    // save user to DB
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));


    // Google+ login ------------------------------------------------------------
    // ---------------------------------------------------------------------------

    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if user found, log him in
                    return done(null, user);
                } else {
                    // if user not in DB create new 
                    var newUser          = new User();

                    // set all user params
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
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
    

