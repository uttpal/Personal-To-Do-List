// app/routes.js
var todo         = require('../routes/todo.js'); //load routes
module.exports = function(app, passport) {

    //homepage
    app.get('/', function(req, res) {
        res.render('index.ejs'); 
    });

    //local auth routes-------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------
    
    //login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('Login to To-Do App') }); 
    });

    //signup
    app.get('/signup', function(req, res) {

        res.render('signup.ejs', { message: req.flash('Signup to To-Do App') });
    });

   //logout
   app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //create new user
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/todo',                  //redirect to todo when success
        failureRedirect : '/signup',                //redirect to signup if failed
        failureFlash : true                         //allow flash messages
    }));

    //validate login
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/todo',                  //redirect to todo when success
        failureRedirect : '/login',                 //redirect to login if failed
        failureFlash : true                         // allow flash messages
    }));


    //facebook auth routes-------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/todo',
            failureRedirect : '/'
        }));

    

    //google+ auth routes--------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------  

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/todo',
                    failureRedirect : '/'
            }));

    //todo app routes------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------  
    //to-do app and login verification
    app.get(  '/todo',              ensureAuthenticated,        todo.home );
    app.post( '/todo/create',       ensureAuthenticated,        todo.create );
    app.get(  '/todo/destroy/:id',  ensureAuthenticated,        todo.destroy );
    app.get(  '/todo/edit/:id',     ensureAuthenticated,        todo.edit );
    app.post( '/todo/update/:id',   ensureAuthenticated,        todo.update );
    app.get( '/todo/done/:id',      ensureAuthenticated,        todo.done );
    app.get( '/todo/new/',          ensureAuthenticated,        todo.new_task );
};

// ensure that user is authenticated else redirect
function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
