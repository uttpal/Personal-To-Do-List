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

