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
      for (i = 0; i < todos.length; i++) {
          todos[i].due_time = +((Number) ((( todos[i].due_time - (new Date()).getTime())/ (1000*60*60)).toFixed(2)));
      }
      
      console.log("im in",todos); 
      res.render( 'todo', {
          todos : todos
      });
    });
};

exports.new_task = function( req, res, next ){

      res.render( 'create');
    
};

//create new task
exports.create = function ( req, res, next ){
  //takes user parameter and set it to new todo object 
  
  //get due date from user substract from current time and convert millisecs to hours 

  new Todo({
      email 	   : req.user.email,
      content    : req.body.content,
      due_time   : (new Date(req.body.due)).getTime(),     //get millisecs from date
      location   : req.body.location,
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


//loads page to edit task
exports.edit = function( req, res, next ){

  Todo.
    find({ email : req.user.email }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'edit', {
        todos   : todos,
        current : req.params.id
      });
    });
};

//called by edit page to edit existing task
exports.update = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){

    //set task to new user content
    todo.content    = req.body.content;

    //save to DB
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );

      res.redirect( '/todo' );
    });
  });
};

//mark the closed task
exports.done = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){

    //set to 1 to identify colsed 
    todo.done    = 1;
    //save to DB
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );

      res.redirect( '/todo' );
    });
  });
};

