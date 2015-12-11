// app/routes.js

module.exports = function(app, passport) {

    //homepage
    app.get('/', function(req, res) {
        res.render('index.ejs'); 
    });

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

   //validate login
   // app.post('/login', passport);

    //to-do app and login verification
    app.get('/todo', ensureAuthenticated, function(req, res) {
        res.render('todo.ejs', {
            user : req.user                         //pass user info to template
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/todo',                  //redirect to todo when success
        failureRedirect : '/signup',                //redirect to signup if failed
        failureFlash : true                         //allow flash messages
    }));

    
};

// ensure that user is authenticated else redirect
function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
