var CronJob         = require('cron').CronJob;
var nodemailer      = require('nodemailer');
var Todo            = require('../app/models/todo.js');

//conigure mail service
var transporter = nodemailer.createTransport();

//mail html------------------------------------------------------------------
//---------------------------------------------------------------------------
var htm1 = '<p>\
    Hi,\
</p>\
<p>\
    Your task ';

var htm2 = " is due by less than 15 minutes, please take an action\
</p>\
<p>\
   <a href=\"http://new-56605.onmodulus.net/todo/done/";

var htm3 = "\">\
   Close\
</a> \
<a href=\"http://new-56605.onmodulus.net/todo/push/";

var htm4 = "\">\
   Push By Tommorrow\
</a> \
</p>\
<p>\
    \
</p>\
<p>\
    Sincerely,\
</p>\
<p>\
    Personal To-Do\
</p>";

//cron job------------------------------------------------------------------
//--------------------------------------------------------------------------

// check for todos every five min
new CronJob('0 */5 * * * *', function() {
  
  //get all todos sorted according to due time 
  Todo.
    find().
    sort( {due_time:1} ).
    exec( function ( err, todos ){
      if( err ) return ;

      for (i = 0; i < todos.length; i++) {
          
          var due       = todos[i].due_time - ( new Date() ).getTime();                     //get due time in millisecs
          var last_noti = ( new Date() ).getTime() - todos[i].last_mailed;                  //get millisecs passed since last email
          
          if(due<900000){                                                                   //if due less than 15 minutes and last notified before 24 hrs mail again
            if(last_noti>86400000){
              transporter.sendMail({
                  from: 'metodo@myto-doapp.com',
                  to: todos[i].email,
                  subject: 'To-Do Gentle Reminder',
                  html: htm1 + todos[i].content + htm2 + todos[i].id + htm3 + todos[i].id + htm4
              });
                console.log("mailed",todos[i].email);
                todos[i].last_mailed = ( new Date() ).getTime();                             //update last mailed to avoid mails every 5 minutes
                todos[i].save( function ( err, todo, count ){});                             //save to DB 
            }  
          }

          else { 
            console.log("notmailed",new Date()); break;}                                     //else break and check again after 5 min
      }
      
      });
    
}, null, true, 'America/Los_Angeles');                                                      //always run timezone america