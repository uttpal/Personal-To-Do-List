var CronJob         = require('cron').CronJob;
var nodemailer      = require('nodemailer');
var Todo            = require('../app/models/todo.js');

//conigure mail service
var transporter = nodemailer.createTransport();



// check for todos every five min
new CronJob('* */5 * * * *', function() {
  
  //get all todos sorted according to due time 
  Todo.
    find().
    sort( {due_time:1} ).
    exec( function ( err, todos ){
      if( err ) return ;

      for (i = 0; i < todos.length; i++) {
          
          var due       = todos[i].due_time - ( new Date() ).getTime();
          var last_noti = ( new Date() ).getTime() - todos[i].last_mailed;
          console.log(last_noti);
          if(due<900000&&last_noti>86400000){
            
            transporter.sendMail({
                from: 'metodo@myto-doapp.com',
                to: todos[i].email,
                subject: 'hello',
                text: 'Hi your task' + todos[i].content + "is due by less than 15 min"
            });
              console.log("mailed");
              todos[i].last_mailed = ( new Date() ).getTime();
              todos[i].save( function ( err, todo, count ){});
            }
          else { console.log("notmailed"); break; }
      }
      
      });
    
}, null, true, 'America/Los_Angeles');