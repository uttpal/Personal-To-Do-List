//routes/todo.js

//load user mongoose model
var Todo = require('../app/models/todo.js');

//runs mailer cron to notify user
require('../cron/mailer.js');

//todo app homepage
exports.home = function ( req, res, next ){

  //Find all todos of current user
  //sort according to due time and return
  Todo.
    find({ email : req.user.email }).
    sort( { due_time:1 } ).
    exec( function ( err, todos ){
      if( err ) return;
      for (i = 0; i < todos.length; i++) {

          //calculate total due time( due time - current time)
          todos[i].due_time = +((Number) ((( todos[i].due_time - (new Date()).getTime())/ (1000*60*60)).toFixed(2)));
      }
      
      res.render( 'todo', {
          todos : todos
      });
    });
};

//render page to create task
exports.new_task = function( req, res ){

  res.render( 'create');
    
};

//create new task
exports.create = function ( req, res ){
  //takes user parameter and set it to new todo object 
  
  //if selected date is less than today don't add
  if(new Date(req.body.due) < new Date()){
      console.log("due");
      res.redirect( '/todo/new/' );
      return;
  }

  new Todo({
      email 	   : req.user.email,
      content    : req.body.content,
      due_time   : (new Date(req.body.due)).getTime(),     //get millisecs from date
      location   : (req.body.location.split(','))[0],      //get street address from location
      updated_at : Date.now()
  }).save( function ( err, todo ){                  //saves new task to DB

    res.redirect( '/todo' );
  });
};


//deletes the task
exports.destroy = function ( req, res ){
  
  //find task by supplied id
  Todo.findById( req.params.id, function ( err, todo ){
    
    if(err||!todo.due_time){
      res.redirect( '/todo' );
      return;
      }    
    
    //deletes from database
    todo.remove( function ( err, todo ){

      res.redirect( '/todo' );
    });
  
  });
};


//pushes due to tommorrow
exports.push = function( req, res ){
  
  Todo.findById( req.params.id, function ( err, todo ){

    if(err||!todo.due_time){
      res.redirect( '/todo' );
      return;
      }    
    
    //add 24 hrs to due time
    todo.due_time = todo.due_time + 86400000;

    //save to DB
    todo.save( function ( err, todo ){

    res.redirect( '/todo' );
    });

  });
};

//called by edit page to edit existing task
exports.update = function( req, res ){
  
  Todo.findById( req.params.id, function ( err, todo ){
    if(err||!todo.due_time){
      res.redirect( '/todo' );
      return;
      }    
    
    //set task to new user content
    todo.content    = req.body.content;

    //save to DB
    todo.save( function ( err, todo ){

      res.redirect( '/todo' );
    });

  });
};

//mark the closed task
exports.done = function( req, res ){
  
  Todo.findById( req.params.id, function ( err, todo ){
      
    if(err||!todo.due_time){
      res.redirect( '/todo' );
      return;
      }    

      //set to 1 to identify colsed 
      todo.done     = 1;
      todo.due_time = (new Date("2030")).getTime();
      //save to DB
      todo.save( function ( err, todo ){
        if( err ) return ;

        res.redirect( '/todo' );
      });

  });
};

