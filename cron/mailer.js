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
          
          var due       = todos[i].due_time - ( new Date() ).getTime();                     //get due time in millisecs
          var last_noti = ( new Date() ).getTime() - todos[i].last_mailed;                  //get millisecs passed since last email
          
          if(due<900000&&last_noti>86400000){                                               //if due less than 15 minutes and last notified before 24 hrs mail again
            
            transporter.sendMail({
                from: 'metodo@myto-doapp.com',
                to: todos[i].email,
                subject: 'To-Do Gentle Reminder',
                text: "Hi your task " + todos[i].content + "is due by less than 15 min"
            });
              console.log("mailed");
              todos[i].last_mailed = ( new Date() ).getTime();                             //update last mailed to avoid mails every 5 minutes
              todos[i].save( function ( err, todo, count ){});                             //save to DB 
            }
          else { break; }                                                                  //else break and check again after 5 min
      }
      
      });
    
}, null, true, 'America/Los_Angeles');                                                    //always run timezone america