//routes/todo.js

var Todo = require('../app/models/todo.js');

exports.home = function ( req, res, next ){

  Todo.
    find({ email : req.user.email }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'todo', {
          title : 'Personal To-Do App',
          todos : todos
      });
    });
};

exports.create = function ( req, res, next ){
  new Todo({
      email 	 : req.user.email,
      content    : req.body.content,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){
    if( err ) return next( err );

    res.redirect( '/todo' );
  });
};

