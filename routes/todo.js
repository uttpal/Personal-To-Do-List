//routes/todo.js

//load user mongoose model
var Todo = require('../app/models/todo.js');

//todo app homepage
exports.home = function ( req, res, next ){

  //Find all todos of current user
  //sort according to creation time and return
  Todo.
    find({ email : req.user.email }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'todo', {
          todos : todos
      });
    });
};

//create new task
exports.create = function ( req, res, next ){
  //takes user parameter and set it to new todo object 
  new Todo({
      email 	 : req.user.email,
      content    : req.body.content,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){     //saves new task to DB.
    if( err ) return next( err );

    res.redirect( '/todo' );
  });
};


//deletes the task
exports.destroy = function ( req, res, next ){
  //find task by supplied id
  Todo.findById( req.params.id, function ( err, todo ){
    
    //deletes from database
    todo.remove( function ( err, todo ){
      if( err ) return next( err );

      res.redirect( '/todo' );
    });
  });
};

