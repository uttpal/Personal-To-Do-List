// app/models/todo.js

var mongoose = require('mongoose');

// todo schema for mongoDB
var todoSchema = mongoose.Schema({

    email    	: String,													//user email
    content     : String,								
    done		: { type: Number, default: 0 },								//task active if 0 done if 1
    location    : String,
    due_time	: Number,													//total no. due of milliseconds since 1970 
    last_mailed : { type: Number, default: (new Date("1970")).getTime() },	//last notified default 1970
    updated_at  : Date

});


// model exposure to app
module.exports = mongoose.model('todo', todoSchema);
